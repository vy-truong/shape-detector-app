import ProfileNav from "../ProfileNav";
import WardrobeView from "./WardrobeView";

export default function WardrobePage() {
  return (
    <main className="bg-heading-hl min-h-screen text-white p-8">
      <ProfileNav />
      <WardrobeView/>
    </main>
  );
}