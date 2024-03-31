import { useState } from "react";
import { Label } from "../config/types";
import { VscClose, VscEdit } from "react-icons/vsc";

type LabelViewProps = {
  label: Label;
};

export default function LabelView({ label }: LabelViewProps) {
  const [editing, setEditing] = useState(false);

  return editing ? <Editing /> : <Viewing />;

  function Viewing() {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
        <p style={{ backgroundColor: label.color }}>{label.color}</p>
        <p>{label.text}</p>
        <p>{label.notes}</p>
        <p>{label.link}</p>
        <div>
          <button onClick={() => setEditing(true)}>
            <VscEdit />
          </button>
        </div>
      </div>
    );
  }

  function Editing() {
    const [notes, setNotes] = useState(label.notes);
    const [link, setLink] = useState(label.link);

    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
        <p style={{ backgroundColor: label.color }}>{label.color}</p>
        <p>{label.text}</p>
        <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
        <input type="text" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Link" />
        <div>
          <button onClick={() => setEditing(false)}>
            <VscClose />
          </button>
        </div>
      </div>
    );
  }
}
