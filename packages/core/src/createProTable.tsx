import { defineComponent, PropType } from "vue";
import { useProTable } from "./useProTable";
import type {
  UseProTableOptions,
  ProColumnType,
  UIAdapterRegistry,
} from "./types";

export function createProTable(
  registry: UIAdapterRegistry,
): import("vue").Component {
  return defineComponent({
    name: "ProTable",
    props: {
      request: {
        type: Function as PropType<UseProTableOptions<any, any>["request"]>,
        required: true,
      },
      columns: {
        type: Array as PropType<ProColumnType<any>[]>,
        default: () => [],
      },
      params: {
        type: [Object, Function] as PropType<
          UseProTableOptions<any, any>["params"]
        >,
      },
      pagination: {
        type: [Boolean, Object] as PropType<
          UseProTableOptions<any, any>["pagination"]
        >,
      },
      manual: { type: Boolean, default: false },
      polling: {
        type: Number as PropType<UseProTableOptions<any, any>["polling"]>,
      },
      debounceTime: {
        type: Number as PropType<UseProTableOptions<any, any>["debounceTime"]>,
      },
      preserveSelectedRowKeys: {
        type: Boolean as PropType<
          UseProTableOptions<any, any>["preserveSelectedRowKeys"]
        >,
      },
      rowSelection: {
        type: Object as PropType<UseProTableOptions<any, any>["rowSelection"]>,
      },
      rowKey: {
        type: [String, Function] as PropType<
          UseProTableOptions<any, any>["rowKey"]
        >,
      },
      search: {
        type: [Boolean, Object] as PropType<
          UseProTableOptions<any, any>["search"]
        >,
      },
      editable: {
        type: Object as PropType<UseProTableOptions<any, any>["editable"]>,
      },
      dateFormatter: {
        type: [String, Boolean] as PropType<
          UseProTableOptions<any, any>["dateFormatter"]
        >,
      },
      beforeSearchSubmit: {
        type: Function as PropType<
          UseProTableOptions<any, any>["beforeSearchSubmit"]
        >,
      },
      postData: {
        type: Function as PropType<UseProTableOptions<any, any>["postData"]>,
      },
      onRequestError: {
        type: Function as PropType<
          UseProTableOptions<any, any>["onRequestError"]
        >,
      },
    },
    setup(props, { slots }) {
      const state = useProTable(props);

      const getAdapter = (type: string) => {
        const adapter = registry[type] || registry["Input"];
        if (adapter && adapter.component) return adapter;
        return { component: adapter };
      };

      const renderForm = () => {
        if (!state.searchableColumns.value.length) return null;

        const FormAdapter = getAdapter("Form");
        const FormItemAdapter = getAdapter("FormItem");
        const ButtonAdapter = getAdapter("Button");
        const FormComp = FormAdapter.component as any;
        const FormItemComp = FormItemAdapter.component as any;
        const ButtonComp = ButtonAdapter.component as any;

        const formProps = FormAdapter.mapProps
          ? FormAdapter.mapProps({ model: state.searchModel })
          : { model: state.searchModel };

        return (
          <div class="pro-table-search">
            <FormComp {...formProps}>
              {state.searchableColumns.value.map((col) => {
                const itemProps = FormItemAdapter.mapProps
                  ? FormItemAdapter.mapProps({
                      label: col.title,
                      prop: col.dataIndex,
                    })
                  : { label: col.title, prop: col.dataIndex };

                let fieldNode: any;
                if (slots[`form-${col.dataIndex}`]) {
                  fieldNode = slots[`form-${col.dataIndex}`]!({
                    model: state.searchModel,
                    field: col.dataIndex,
                  });
                } else if (col.renderFormItem) {
                  fieldNode = col.renderFormItem(
                    state.searchModel,
                    col.dataIndex,
                  );
                } else {
                  const FieldAdapter = getAdapter(col.valueType || "Input");
                  const FieldComp = FieldAdapter.component as any;
                  const fieldProps = {
                    value: state.searchModel[col.dataIndex],
                    onChange: (val: any) =>
                      state.updateSearchModel(col.dataIndex, val),
                    options: state.valueEnumMap.value[col.dataIndex],
                    loading: state.valueEnumLoadingMap.value[col.dataIndex],
                  };
                  const mappedFieldProps = FieldAdapter.mapProps
                    ? FieldAdapter.mapProps(fieldProps)
                    : fieldProps;
                  fieldNode = <FieldComp {...mappedFieldProps} />;
                }

                return (
                  <FormItemComp key={col.dataIndex} {...itemProps}>
                    {fieldNode}
                  </FormItemComp>
                );
              })}
              <FormItemComp>
                <ButtonComp
                  type="primary"
                  onClick={() => state.action.reload()}
                >
                  查询
                </ButtonComp>
                <ButtonComp
                  style="margin-left: 8px"
                  onClick={() => state.action.reset()}
                >
                  重置
                </ButtonComp>
              </FormItemComp>
            </FormComp>
          </div>
        );
      };

      const renderTable = () => {
        const TableAdapter = getAdapter("Table");
        const TableComp = TableAdapter.component as any;
        const tableProps = {
          dataSource: state.dataSource.value,
          columns: state.tableColumns.value,
          loading: state.loading.value,
          rowSelection: props.rowSelection
            ? {
                ...props.rowSelection,
                selectedRowKeys: state.selectedRowKeys.value,
                onChange: state.onRowSelectionChange,
              }
            : undefined,
          onTableChange: state.onTableChange,
          valueEnumMap: state.valueEnumMap.value,
        };
        const mappedProps = TableAdapter.mapProps
          ? TableAdapter.mapProps(tableProps)
          : tableProps;

        return (
          <div class="pro-table-body" style="margin-top: 16px">
            <TableComp {...mappedProps} v-slots={slots} />
          </div>
        );
      };

      const renderPagination = () => {
        if (props.pagination === false) return null;

        const PaginationAdapter = getAdapter("Pagination");
        const PaginationComp = PaginationAdapter.component as any;
        const paginationProps = {
          current: state.pagination.current,
          pageSize: state.pagination.pageSize,
          total: state.pagination.total,
          onChange: state.onPaginationChange,
        };
        const mappedProps = PaginationAdapter.mapProps
          ? PaginationAdapter.mapProps(paginationProps)
          : paginationProps;

        return (
          <div
            class="pro-table-pagination"
            style="margin-top: 16px; text-align: right"
          >
            <PaginationComp {...mappedProps} />
          </div>
        );
      };

      return () => (
        <div class="headless-pro-table">
          {renderForm()}
          {renderTable()}
          {renderPagination()}
        </div>
      );
    },
  });
}
