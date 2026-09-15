import Link from "next/link";

type WorkSearchFilterProps = {
  query: string;
  selectedGenre?: string;
  selectedType?: string;
};

const filters = [
  { label: "すべて", value: "" },
  { label: "映画", value: "movie" },
  { label: "TVシリーズ", value: "tv" },
];

/**
 * 作品検索結果の絞り込み条件を表示する。
 * 映画、TVシリーズで検索結果を切り替える。
 */
export default function WorkSearchFilter({
  query,
  selectedGenre = "",
  selectedType = "",
}: WorkSearchFilterProps) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {filters.map((filter) => {
        const isSelected = selectedType === filter.value;

        const params = new URLSearchParams();

        if (query) {
          params.set("query", query);
        }

        if (selectedGenre) {
          params.set("genre", selectedGenre);
        }

        if (filter.value) {
          params.set("type", filter.value);
        }

        return (
          <Link
            key={filter.value}
            href={`/works/search?${params.toString()}`}
            className={`rounded-lg border px-4 py-2 text-sm transition ${
              isSelected
                ? "border-indigo-400 bg-indigo-500 text-white"
                : "border-slate-700 text-slate-300 hover:border-indigo-400 hover:text-white"
            }`}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
