import React, { useEffect, useState } from "react";

const STORAGE_KEY = "notes-crud-localstorage";

function App() {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY);

    if (!savedNotes) {
      return;
    }

    try {
      const parsed = JSON.parse(savedNotes);
      if (Array.isArray(parsed)) {
        setNotes(parsed);
      }
    } catch {
      setNotes([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const resetForm = () => {
    setInput("");
    setEditingId(null);
  };

  const addOrUpdateNote = (event) => {
    event.preventDefault();

    const value = input.trim();
    if (!value) {
      return;
    }

    if (editingId) {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingId ? { ...note, text: value, updatedAt: Date.now() } : note,
        ),
      );
      resetForm();
      return;
    }

    const note = {
      id: crypto.randomUUID(),
      text: value,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setNotes((prev) => [note, ...prev]);
    resetForm();
  };

  const removeNote = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  const startEditing = (note) => {
    setInput(note.text);
    setEditingId(note.id);
  };

  return (
    <main className="min-h-screen bg-slate-200 px-4 py-10 text-slate-700 sm:px-6">
      <section className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-300 bg-slate-100 p-6 shadow-[0_10px_35px_rgba(15,23,42,0.08)] sm:p-7">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Notes CRUD (localStorage)</h1>
        <p className="mt-2 text-lg text-slate-600">Wireframe-friendly layout to demo CRUD + localStorage.</p>

        <div className="mt-6 rounded-xl border border-dashed border-blue-300 p-4 sm:p-5">
          <p className="text-xs font-semibold tracking-[0.38em] text-slate-600">CREATE NOTE</p>

          <form className="mt-3 flex flex-col gap-3 sm:flex-row" onSubmit={addOrUpdateNote}>
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Enter a note"
              className="h-12 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-base outline-none ring-0 transition placeholder:text-slate-400 focus:border-slate-400"
            />
            <button
              type="submit"
              className="h-12 rounded-xl bg-slate-900 px-6 text-base font-semibold text-white transition hover:bg-slate-800"
            >
              {editingId ? "Update Note" : "Add Note"}
            </button>
          </form>
        </div>

        <div className="mt-5 rounded-xl border border-dashed border-blue-300 p-4 sm:p-5">
          <p className="text-xs font-semibold tracking-[0.38em] text-slate-600">NOTES</p>

          <div className="mt-3 rounded-xl border border-dashed border-blue-300 bg-slate-50 p-3 sm:p-4">
            {notes.length === 0 ? (
              <p className="py-3 text-center text-base text-slate-500">No notes yet.</p>
            ) : (
              <ul className="space-y-2">
                {notes.map((note) => (
                  <li
                    key={note.id}
                    className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <p className="break-words text-base text-slate-700">{note.text}</p>
                    <div className="flex gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => startEditing(note)}
                        className="rounded-md border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeNote(note.id)}
                        className="rounded-md border border-red-200 px-3 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
