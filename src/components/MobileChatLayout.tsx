"use client";

import { Transition, Dialog } from "@headlessui/react";
import { LucideUsers, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, Fragment, useEffect, useState } from "react";
import { Icons } from "./Icons";
import SignOutButton from "./SignOutButton";
import Button, { buttonVariants } from "./ui/Button";
import FriendRequestSidebarOptions from "./FriendRequestSidebarOptions";
import SidebarChatList from "./SidebarChatList";
import { Session } from "next-auth";
import { SidebarOption } from "@/types/typings";
import { usePathname } from "next/navigation";
import DmLogo from "@/images/logo.png";
interface MobileChatLayoutProps {
  friends: User[];
  session: Session;
  sidebarOptions: SidebarOption[];
  unseenRequestCount: number;
}

const MobileChatLayout: FC<MobileChatLayoutProps> = ({
  friends,
  session,
  sidebarOptions,
  unseenRequestCount,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Define an array of route paths where you want to hide the header
  const routesWithoutHeader = ["/chat"]; // Replace with your route paths

  // Check if the current route is in the routesWithoutHeader array
  const hideHeader = pathname?.includes("/chat");

  return (
    <div
      className={`${
        hideHeader ? "hidden" : "fixed"
      }  bg-zinc-50 border-b border-zinc-200  top-0 inset-x-0 py-2 px-4`}
    >
      <div className="w-full flex justify-between items-center pb-1.5">
        <Link className="flex items-center gap-2" href="/dashboard">
          <Image className="rounded-full w-10 h-10" src={DmLogo} alt="logo" />
          <span className="font-bold  text-gray-600">DM</span>
        </Link>
        <Button onClick={() => setOpen(true)} className="gap-4 ">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="-translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="-translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-hidden bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between  ">
                          <div>
                            <div className="flex flex-1  items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                              <div className="relative h-10 w-10 bg-gray-50 rounded-full">
                                <Image
                                  fill
                                  className="rounded-full"
                                  src={session.user.image || ""}
                                  alt="Your profile picture"
                                />
                              </div>

                              <span className="sr-only">Your profile</span>
                              <div className="flex flex-col">
                                <span aria-hidden="true">
                                  {session.user.name}
                                </span>
                                <span
                                  className="text-xs text-zinc-400"
                                  aria-hidden="true"
                                >
                                  {session.user.email}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <X className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 flex flex-col px-4 sm:px-6">
                        {/* Content */}

                        <nav className="flex flex-1 flex-col ">
                          <ul
                            role="list"
                            className="flex flex-1 flex-col gap-y-7 "
                          >
                            <li>
                              <ul role="list" className="-mx-2 mt-2 space-y-1">
                                {sidebarOptions.map((option) => {
                                  const Icon = Icons[option.Icon];
                                  return (
                                    <li key={option.name}>
                                      <Link
                                        href={option.href}
                                        className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                      >
                                        <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                                          <Icon className="h-4 w-4" />
                                        </span>
                                        <span className="truncate">
                                          {option.name}
                                        </span>
                                      </Link>
                                    </li>
                                  );
                                })}

                                <li>
                                  <FriendRequestSidebarOptions
                                    initialUnseenRequestCount={
                                      unseenRequestCount
                                    }
                                    sessionId={session.user.id}
                                  />
                                </li>
                              </ul>
                            </li>

                            <li>
                              <div className="flex items-center justify-start  gap-2  ">
                                <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                                  <LucideUsers className="h-5 w-5" />
                                </span>
                                <span className="font-bold  text-gray-600 ">
                                  Friends
                                </span>
                              </div>
                              <SidebarChatList
                                friends={friends}
                                sessionId={session.user.id}
                              />
                            </li>
                          </ul>
                        </nav>

                        <div className="-ml-6 mt-auto flex flex-col items-center justify-end   px-3">
                          <SignOutButton className="h-full aspect-square" />
                        </div>
                        {/* content end */}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default MobileChatLayout;
