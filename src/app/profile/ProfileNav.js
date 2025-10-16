import Link from "next/link";

export default function ProfileNav() {
  return (
    <div className="flex justify-center sm:justify-start gap-4 mb-6 text-white text-sm font-medium">
      <Link href="/profile" className="hover:underline">Body Shape</Link>
      <Link href="/profile/wardrobe" className="hover:underline">My Wardrobe</Link>
      <Link href="/profile/mixmatch" className="hover:underline">Mix & Match</Link>
      <Link href="/profile/outfits" className="hover:underline">Saved Outfits</Link>
    </div>
  );
}
