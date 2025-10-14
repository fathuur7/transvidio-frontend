import React from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Save, X, Download } from "lucide-react";


export const SubtitleList = ({ subtitles, currentTime, editingIndex, editText, setEditText, onEdit, onSave, onCancel, onDownload }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
        Daftar Subtitle
      </h3>
      <Button onClick={onDownload} className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Download SRT
      </Button>
    </div>

    <div className="max-h-96 overflow-y-auto space-y-2 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
      {subtitles.map((sub, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg border transition ${
            currentTime >= sub.startSeconds && currentTime <= sub.endSeconds
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
          }`}
        >
          {editingIndex === index ? (
            <div className="space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                rows={3}
              />
              <div className="flex gap-2">
                <Button onClick={onSave} size="sm" className="flex-1">
                  <Save className="h-4 w-4 mr-1" />
                  Simpan
                </Button>
                <Button onClick={onCancel} size="sm" variant="outline" className="flex-1">
                  <X className="h-4 w-4 mr-1" />
                  Batal
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  {sub.start} → {sub.end}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {sub.text}
                </p>
              </div>
              <Button
                onClick={() => onEdit(index, sub.text)}
                size="sm"
                variant="ghost"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);
