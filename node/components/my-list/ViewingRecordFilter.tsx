import type { ViewingRecordStatusFilter } from "@/types/viewingRecord";

type ViewingRecordFilterProps = {
  value: ViewingRecordStatusFilter;
  onChange: (value: ViewingRecordStatusFilter) => void;
};

const statusFilterOptions: {
  value: ViewingRecordStatusFilter;
  label: string;
}[] = [
  { value: "all", label: "すべて" },
  { value: "want_to_watch", label: "観たい" },
  { value: "watching", label: "視聴中" },
  { value: "watched", label: "視聴済み" },
  { value: "dropped", label: "中断" },
];

/**
 * マイリストを視聴状況で絞り込むセレクトボックスを表示する。
 */
export function ViewingRecordFilter({
  value,
  onChange,
}: ViewingRecordFilterProps) {
  return (
    <div className="mt-8">
      <label
        htmlFor="viewing-status-filter"
        className="block text-sm font-semibold text-slate-200"
      >
        視聴状況で絞り込む
      </label>

      <select
        id="viewing-status-filter"
        value={value}
        onChange={(event) =>
          onChange(event.target.value as ViewingRecordStatusFilter)
        }
        className="mt-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
      >
        {statusFilterOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
