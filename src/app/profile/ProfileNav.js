import Link from "next/link";

export default function ProfileNav() {
  return (
    <div className="flex justify-center sm:justify-start gap-4 mb-6 text-white text-sm font-medium">
      <Link href="/profile/wardrobe" className="hover:underline">
        My Wardrobe
      </Link>
      <Link href="/profile/savedcollection" className="hover:underline">
        Saved
      </Link>

    </div>
  );
}
