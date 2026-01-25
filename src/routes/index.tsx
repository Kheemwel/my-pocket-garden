// Main game page
import { Title } from "@solidjs/meta";
import { GameLayout } from "~/components/Layout/GameLayout";
import "~/styles/theme.css";

export default function Home() {
  return (
    <>
      <Title>My Pocket Garden</Title>
      <GameLayout />
    </>
  );
}
