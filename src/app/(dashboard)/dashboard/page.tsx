import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { chatHrefConstructor } from "@/lib/utils";
import { ChevronRight, LucideMessageSquare, LucideUsers } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const page = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const friends = await getFriendsByUserId(session.user.id);

  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessageRaw] = (await fetchRedis(
        "zrange",
        `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
        -1,
        -1
      )) as string[];

      // console.log("lastMessageRaw", lastMessageRaw);

      const lastMessage = lastMessageRaw
        ? (JSON.parse(lastMessageRaw) as Message)
        : null;

      return {
        ...friend,
        lastMessage,
      };
    })
  );

  // console.log(friendsWithLastMessage);
  return (
    <div className="container py-20 md:py-10 ">
      <h1 className="font-bold text-5xl mb-8">Recent chats</h1>
      {friendsWithLastMessage &&
      friendsWithLastMessage.filter((friend) => friend.lastMessage !== null)
        .length > 0 ? (
        friendsWithLastMessage
          .filter((friend) => friend.lastMessage !== null)
          .map((friend) => (
            <div
              key={friend.id}
              className="relative bg-zinc-50 border border-zinc-200 p-3 rounded-md"
            >
              <div className="absolute right-4 inset-y-0 flex items-center">
                <ChevronRight className="h-7 w-7 text-zinc-400" />
              </div>

              <Link
                href={`/dashboard/chat/${chatHrefConstructor(
                  session.user.id,
                  friend.id
                )}`}
                className="relative flex"
              >
                <div className="mb-4 flex-shrink-0 sm:mb-0 mr-2">
                  <div className="relative rounded-full h-8 w-8">
                    <Image
                      referrerPolicy="no-referrer"
                      className="rounded-full"
                      alt={`${friend.name} profile picture`}
                      src={friend.image}
                      fill
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold">{friend.name}</h4>
                  <p className="mt-1 max-w-md">
                    <span className="text-zinc-400">
                      {friend?.lastMessage?.senderId === session.user.id
                        ? "You: "
                        : ""}
                    </span>
                    <span className="">{friend?.lastMessage?.text}</span>
                  </p>
                </div>
              </Link>
            </div>
          ))
      ) : (
        <p className="text-sm text-zinc-500">Nothing to show here...</p>
      )}
    </div>
  );
};

export default page;
