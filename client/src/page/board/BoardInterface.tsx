// BoardInterface.tsx
interface BoardInterface {
  _id: string;
  user_id: string;
  board_title: string;
  board_content: string;
  board_regdate: Date;
  board_update: Date;
}

export default BoardInterface;