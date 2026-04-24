import { createProTable } from "@vue-protable/core";
import { defineComponent, type PropType } from "vue";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Form from "@/components/ui/form/Form.vue";
import FormItem from "@/components/ui/form/FormItem.vue";
import Table from "@/components/ui/table/Table.vue";
import TableHeader from "@/components/ui/table/TableHeader.vue";
import TableHead from "@/components/ui/table/TableHead.vue";
import TableBody from "@/components/ui/table/TableBody.vue";
import TableRow from "@/components/ui/table/TableRow.vue";
import TableCell from "@/components/ui/table/TableCell.vue";

interface ColumnType {
  dataIndex: string;
  title: string;
  render?: (value: any, record: any) => any;
  valueEnum?: Record<string, { text: string } | string>;
}

interface RowSelectionType {
  selectedRowKeys?: any[];
  onChange?: (keys: any[]) => void;
}

// 自定义 Table 包装器
const ShadcnTableWrapper = defineComponent({
  name: "ShadcnTableWrapper",
  props: {
    columns: {
      type: Array as PropType<ColumnType[]>,
      default: () => [],
    },
    dataSource: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    rowKey: {
      type: [String, Function] as PropType<string | ((record: any) => any)>,
      default: "id",
    },
    rowSelection: {
      type: Object as PropType<RowSelectionType>,
    },
    onChange: {
      type: Function as PropType<
        (pagination: any, filters: any, sorter: any) => void
      >,
    },
  },
  setup(props) {
    const handleRowClick = (record: any) => {
      if (props.rowSelection) {
        const key =
          typeof props.rowKey === "function"
            ? props.rowKey(record)
            : record[props.rowKey || "id"];
        const selectedKeys = props.rowSelection.selectedRowKeys || [];
        const newKeys = selectedKeys.includes(key)
          ? selectedKeys.filter((k: any) => k !== key)
          : [...selectedKeys, key];
        props.rowSelection.onChange?.(newKeys);
      }
    };

    const handleSelectAll = (e: any) => {
      if (e.target.checked) {
        const allKeys =
          props.dataSource?.map((record: any) =>
            typeof props.rowKey === "function"
              ? props.rowKey(record)
              : record[props.rowKey || "id"],
          ) || [];
        props.rowSelection?.onChange?.(allKeys);
      } else {
        props.rowSelection?.onChange?.([]);
      }
    };

    const isAllSelected = () => {
      return (
        props.dataSource?.length > 0 &&
        props.dataSource.every((record: any) => {
          const key =
            typeof props.rowKey === "function"
              ? props.rowKey(record)
              : record[props.rowKey || "id"];
          return props.rowSelection?.selectedRowKeys?.includes(key);
        })
      );
    };

    return () => (
      <Table>
        <TableHeader>
          <TableRow>
            {props.rowSelection && (
              <TableHead class="w-12">
                <input
                  type="checkbox"
                  class="rounded border-input"
                  checked={isAllSelected()}
                  onChange={handleSelectAll}
                />
              </TableHead>
            )}
            {props.columns.map((col: any) => (
              <TableHead key={col.dataIndex}>{col.title}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.loading ? (
            <TableRow>
              <TableCell
                colspan={props.columns.length + (props.rowSelection ? 1 : 0)}
                class="text-center py-8 text-muted-foreground"
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : props.dataSource?.length === 0 ? (
            <TableRow>
              <TableCell
                colspan={props.columns.length + (props.rowSelection ? 1 : 0)}
                class="text-center py-8 text-muted-foreground"
              >
                No data
              </TableCell>
            </TableRow>
          ) : (
            props.dataSource?.map((record: any) => {
              const rowKey =
                typeof props.rowKey === "function"
                  ? props.rowKey(record)
                  : record[props.rowKey || "id"];
              const isSelected =
                props.rowSelection?.selectedRowKeys?.includes(rowKey);

              return (
                <TableRow
                  key={rowKey}
                  class={cn(
                    props.rowSelection && "cursor-pointer",
                    isSelected && "bg-muted/50",
                  )}
                  onClick={() => handleRowClick(record)}
                >
                  {props.rowSelection && (
                    <TableCell>
                      <input
                        type="checkbox"
                        class="rounded border-input"
                        checked={isSelected}
                        onClick={(e: Event) => e.stopPropagation()}
                      />
                    </TableCell>
                  )}
                  {props.columns.map((col: any) => {
                    const value = record[col.dataIndex];
                    let content = value;
                    if (col.render) {
                      content = col.render(value, record);
                    } else if (col.valueEnum) {
                      const enumItem = col.valueEnum[value];
                      content = enumItem?.text || value;
                    }
                    return <TableCell key={col.dataIndex}>{content}</TableCell>;
                  })}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    );
  },
});

// 创建 shadcn-vue ProTable
export const ShadcnProTable = createProTable({
  Table: ShadcnTableWrapper,

  Form: {
    component: Form,
    mapProps: (props: any) => ({
      model: props.model,
      class: "mb-4 p-4 border border-border rounded-lg bg-card",
    }),
  },

  FormItem: {
    component: FormItem,
    mapProps: (props: any) => ({
      label: props.label,
      prop: props.prop,
    }),
  },

  Pagination: {
    component: defineComponent({
      props: ["total", "current", "pageSize", "onChange"],
      setup(props: any) {
        const totalPages = () => Math.ceil(props.total / props.pageSize);
        return () => (
          <div class="flex items-center justify-between px-2 py-4">
            <div class="text-sm text-muted-foreground">
              Total {props.total} items
            </div>
            <div class="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={props.current === 1}
                onClick={() =>
                  props.onChange(props.current - 1, props.pageSize)
                }
              >
                Previous
              </Button>
              <span class="text-sm">
                Page {props.current} of {totalPages()}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={props.current >= totalPages()}
                onClick={() =>
                  props.onChange(props.current + 1, props.pageSize)
                }
              >
                Next
              </Button>
            </div>
          </div>
        );
      },
    }),
  },

  Button,

  text: {
    component: Input,
    mapProps: (props: any) => ({
      modelValue: props.value,
      "onUpdate:modelValue": props.onChange,
      placeholder: "请输入",
    }),
  },

  select: {
    component: defineComponent({
      props: ["value", "onChange", "options", "placeholder"],
      setup(props: any) {
        const normalizedOptions = () =>
          Array.isArray(props.options)
            ? props.options
            : Object.entries(props.options || {}).map(([value, item]: any) => ({
                label: typeof item === "string" ? item : item.text,
                value,
              }));
        return () => (
          <Select modelValue={props.value} onUpdate:modelValue={props.onChange}>
            <SelectTrigger>
              <SelectValue placeholder={props.placeholder || "请选择"} />
            </SelectTrigger>
            <SelectContent>
              {normalizedOptions().map((opt: any) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    }),
    mapProps: (props: any) => props,
  },
});

export default ShadcnProTable;
