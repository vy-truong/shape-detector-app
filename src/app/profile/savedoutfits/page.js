import ProfileNav from "../ProfileNav";
import WardrobeView from "./WardrobeView";

export default function WardrobePage() {
  return (
    <main className="bg-heading-hl min-h-screen text-white p-8">
      <ProfileNav />
      <h1 className="text-2xl font-fraunces mb-4">Saved Outfits</h1>
      <WardrobeView/>
    </main>
  );
}