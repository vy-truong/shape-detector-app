import ProfileNav from "../ProfileNav";
import SavedCollectionPage from "./SavedCollectionPage";



export default function SavedPage() {
  return (
    <main className="bg-heading-hl min-h-screen text-white p-8">
      <ProfileNav />
      <h1 className="text-2xl font-fraunces mb-4">Saved Outfits</h1>
      <SavedCollectionPage />
    </main>
  );
}