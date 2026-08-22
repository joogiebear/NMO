/**
 * The people behind NMO. Faces build more trust than any mission statement,
 * so add a photo for each person when you have one.
 *
 * Leave the array empty and the board section hides itself.
 */

export type BoardMember = {
  name: string;
  role: string;
  /** Optional single sentence — how they knew Nina works well here. */
  bio?: string;
  photo?: string;
};

export const board: BoardMember[] = [
  { name: "TODO_Name", role: "President" },
  { name: "TODO_Name", role: "Chief Executive Officer" },
  { name: "TODO_Name", role: "Chief Financial Officer" },
  { name: "TODO_Name", role: "Chief Operating Officer" },
];
