import React, { type FC } from "react";
import type { Note } from "../types";

interface DbDisplayProps {
  notes: Note[];
  dbType: string; // "MySQL", "PostgreSQL"
}

const DbDisplay: FC<DbDisplayProps> = ({ notes, dbType }) => {
  return (
    <div className="note-container">
      {notes.length > 0 ? (
        notes.map((note) => (
          <div className="note" key={`${dbType}-${note.id}`}>
            {note.content}
          </div>
        ))
      ) : (
        <div className="empty-message">Keine Daten in {dbType} vorhanden</div>
      )}
    </div>
  );
};

export default DbDisplay;
