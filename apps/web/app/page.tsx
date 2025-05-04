"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  // todo: use react-hook-form to handle form data
  // todo: use react-query to fetch data from the backend
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  return (
    <div>
      <input value={roomId} onChange={(e) => {
        setRoomId(e.target.value);
      }} type="text" placeholder="Room id"></input>
      <button onClick={() => {
        router.push(`/room/${roomId}`)
      }}>Join room</button>
    </div>
  );
}
