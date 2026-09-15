import Link from "next/link";

type Genre = {
  id: number;
  name: string;
};

type WorkGenreFilterProps = {
  selectedType?: string;
  selectedGenre?: string;
  genres: Genre[];
};

/**
 * ジャンルから作品を検索するための条件を表示する。
 */
export default function WorkGenreFilter({
  selectedType = "",
  selectedGenre = "",
  genres,
}: WorkGenreFilterProps) {
  return (
    <details className="mt-4">
      <summary className="cursor-pointer text-sm font-medium text-indigo-300 hover:text-indigo-200">
        ジャンル一覧を表示
      </summary>

      <div className="mt-4 flex flex-wrap gap-3">
        {genres.map((genre) => {
          const genreId = String(genre.id);
          const isSelected = selectedGenre === genreId;

          const params = new URLSearchParams({
            genre: genreId,
          });

          if (selectedType) {
            params.set("type", selectedType);
          }

          return (
            <Link
              key={genre.id}
              href={`/works/search?${params.toString()}`}
              className={`rounded-lg border px-4 py-2 text-sm transition ${
                isSelected
                  ? "border-indigo-400 bg-indigo-500 text-white"
                  : "border-slate-700 text-slate-300 hover:border-indigo-400 hover:text-white"
              }`}
            >
              {genre.name}
            </Link>
          );
        })}
      </div>
    </details>
  );
}
