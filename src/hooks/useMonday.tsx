import { useEffect, useState } from "react";
import client, { monday } from "../config/config";
import { Column, Themes } from "../config/types";
import { labelQuery, mergeWithDB, readToLabels } from "../config/helpers";

export default function useMonday() {
  const [bid, setBid] = useState("");
  const [theme, setTheme] = useState<Themes>("dark");
  const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    monday.execute("valueCreatedForUser");

    monday.listen("context", (res) => {
      const unchecked = res.data as any;
      setTheme(unchecked.theme);
      if (!res.data.user.isViewOnly) {
        setBid(unchecked.boardId.toString());
      }
    });

    async function fetchData() {
      try {
        if (!bid || bid === "") return;
        const data = await monday.api(labelQuery(bid));
        const columns = data.data.boards[0]?.columns;
        const mondayLabels = readToLabels(columns, bid);
        const rs = await client.execute({
          sql: "select * from labels where bid = ?",
          args: [bid],
        });
        const labels = mergeWithDB(mondayLabels, rs);
        setColumns(labels);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [bid]);

  function updateLinkAndCreator(
    cid: string,
    ind: string,
    link: string,
    creator: string
  ) {
    let copy = [...columns];
    for (const col of copy) {
      if (col.cid === cid) {
        for (const label of col.labels) {
          if (label.ind === ind) {
            label.link = link;
            label.creator = creator;
            break;
          }
        }
      }
    }
    setColumns(copy);
  }

  function updateNotes(cid: string, ind: string, notes: string) {
    let copy = [...columns];
    for (const col of copy) {
      if (col.cid === cid) {
        for (const label of col.labels) {
          if (label.ind === ind) {
            label.notes = notes;
            break;
          }
        }
      }
    }
    setColumns(copy);
  }

  return { theme, columns, updateLinkAndCreator, updateNotes };
}
