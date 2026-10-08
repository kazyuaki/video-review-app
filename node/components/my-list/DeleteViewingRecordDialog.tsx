import type { ViewingRecord } from "@/types/viewingRecord";

type DeleteViewingRecordDialogProps = {
  viewingRecord: ViewingRecord;
  isDeleting: boolean;
  error: string;
  onCancel: () => void;
  onConfirm: () => void;
};

/**
 * 視聴記録をマイリストから削除する確認ダイアログを表示する。
 */
export function DeleteViewingRecordDialog({
  viewingRecord,
  isDeleting,
  error,
  onCancel,
  onConfirm,
}: DeleteViewingRecordDialogProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-viewing-record-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <h2
          id="delete-viewing-record-title"
          className="text-xl font-bold text-white"
        >
          マイリストから削除しますか？
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          「{viewingRecord.work.title}
          」の視聴記録を削除します。元に戻すことはできません。
        </p>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            キャンセル
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "削除中..." : "削除する"}
          </button>
        </div>
      </div>
    </div>
  );
}
