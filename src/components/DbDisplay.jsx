import React from "react";

const DbDisplay = ({ notes, dbType }) => {
  return (
    <div className="note-container">
      {notes.length > 0 ? (
        notes.map((note) => (
          <div className="note" key={note.id}>
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
