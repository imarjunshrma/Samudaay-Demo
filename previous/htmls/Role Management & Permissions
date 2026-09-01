<!DOCTYPE html>

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link
      href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&amp;display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&amp;display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap"
      rel="stylesheet"
    />
    <script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              primary: "#f2780d",
              "background-light": "#f8f7f5",
              "background-dark": "#221810",
            },
            fontFamily: {
              display: ["Public Sans", "sans-serif"],
            },
            borderRadius: {
              DEFAULT: "0.25rem",
              lg: "0.5rem",
              xl: "0.75rem",
              full: "9999px",
            },
          },
        },
      };
    </script>
    <title>Role Management - Indian Cobbler Community</title>
    <style>
      body {
        min-height: max(884px, 100dvh);
      }
    </style>
  </head>
  <body
    class="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen"
  >
    <div class="relative flex min-h-screen flex-col overflow-x-hidden">
      <header
        class="sticky top-0 z-10 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-4 border-b border-primary/10 justify-between"
      >
        <div class="flex items-center gap-4">
          <div
            class="text-primary flex size-10 items-center justify-center rounded-lg bg-primary/10"
          >
            <span class="material-symbols-outlined">arrow_back</span>
          </div>
          <div>
            <h1 class="text-xl font-bold leading-tight tracking-tight">
              Role Management
            </h1>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Configure community access levels
            </p>
          </div>
        </div>
        <div class="flex gap-2">
          <button
            class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
          >
            <span class="material-symbols-outlined">search</span>
          </button>
          <button
            class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
          >
            <span class="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </header>
      <main class="flex-1 pb-24">
        <div class="px-4 py-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold">Existing Roles</h2>
            <span
              class="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full uppercase tracking-wider"
              >6 Roles Active</span
            >
          </div>
          <div class="space-y-4">
            <!-- Super Admin Card -->
            <div
              class="bg-white dark:bg-slate-800/50 rounded-xl overflow-hidden shadow-sm border border-primary/5"
            >
              <div
                class="p-4 border-b border-primary/5 flex justify-between items-start"
              >
                <div class="flex gap-4 items-center">
                  <div
                    class="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-white"
                    data-alt="Abstract orange shield icon for super admin"
                  >
                    <span class="material-symbols-outlined text-2xl"
                      >admin_panel_settings</span
                    >
                  </div>
                  <div>
                    <h3 class="font-bold text-lg">Super Admin</h3>
                    <p class="text-sm text-slate-500">
                      Ultimate access to all modules
                    </p>
                  </div>
                </div>
                <button
                  class="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg flex items-center gap-2"
                >
                  <span class="material-symbols-outlined text-sm">edit</span>
                  Edit
                </button>
              </div>
              <div class="p-4 bg-primary/5">
                <p class="text-xs font-bold text-primary uppercase mb-3">
                  Permissions Summary
                </p>
                <div class="flex flex-wrap gap-2">
                  <span
                    class="px-2 py-1 bg-white dark:bg-slate-700 rounded text-xs border border-primary/10"
                    >Manage Members</span
                  >
                  <span
                    class="px-2 py-1 bg-white dark:bg-slate-700 rounded text-xs border border-primary/10"
                    >Financial Approvals</span
                  >
                  <span
                    class="px-2 py-1 bg-white dark:bg-slate-700 rounded text-xs border border-primary/10"
                    >System Settings</span
                  >
                  <span
                    class="px-2 py-1 bg-white dark:bg-slate-700 rounded text-xs border border-primary/10"
                    >Content Moderation</span
                  >
                  <span
                    class="px-2 py-1 bg-white dark:bg-slate-700 rounded text-xs border border-primary/10"
                    >+8 more</span
                  >
                </div>
              </div>
            </div>
            <!-- Event Admin Card -->
            <div
              class="bg-white dark:bg-slate-800/50 rounded-xl overflow-hidden shadow-sm border border-primary/5"
            >
              <div
                class="p-4 border-b border-primary/5 flex justify-between items-start"
              >
                <div class="flex gap-4 items-center">
                  <div
                    class="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary"
                    data-alt="Calendar and event planning illustration icon"
                  >
                    <span class="material-symbols-outlined text-2xl"
                      >event_available</span
                    >
                  </div>
                  <div>
                    <h3 class="font-bold text-lg">Event Admin</h3>
                    <p class="text-sm text-slate-500">
                      Organizes community gatherings
                    </p>
                  </div>
                </div>
                <button
                  class="px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-lg flex items-center gap-2"
                >
                  <span class="material-symbols-outlined text-sm">edit</span>
                  Edit
                </button>
              </div>
              <div class="p-4">
                <p class="text-xs font-bold text-slate-400 uppercase mb-3">
                  Permissions Summary
                </p>
                <div class="flex flex-wrap gap-2">
                  <span
                    class="px-2 py-1 bg-background-light dark:bg-slate-700 rounded text-xs border border-primary/5"
                    >Create Events</span
                  >
                  <span
                    class="px-2 py-1 bg-background-light dark:bg-slate-700 rounded text-xs border border-primary/5"
                    >RSVP Management</span
                  >
                  <span
                    class="px-2 py-1 bg-background-light dark:bg-slate-700 rounded text-xs border border-primary/5"
                    >Vendor Contacts</span
                  >
                </div>
              </div>
            </div>
            <!-- Donation Admin Card -->
            <div
              class="bg-white dark:bg-slate-800/50 rounded-xl overflow-hidden shadow-sm border border-primary/5"
            >
              <div
                class="p-4 border-b border-primary/5 flex justify-between items-start"
              >
                <div class="flex gap-4 items-center">
                  <div
                    class="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary"
                    data-alt="Monetary and heart icon for donation admin"
                  >
                    <span class="material-symbols-outlined text-2xl"
                      >volunteer_activism</span
                    >
                  </div>
                  <div>
                    <h3 class="font-bold text-lg">Donation Admin</h3>
                    <p class="text-sm text-slate-500">
                      Manages fund collection &amp; relief
                    </p>
                  </div>
                </div>
                <button
                  class="px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-lg flex items-center gap-2"
                >
                  <span class="material-symbols-outlined text-sm">edit</span>
                  Edit
                </button>
              </div>
              <div class="p-4">
                <p class="text-xs font-bold text-slate-400 uppercase mb-3">
                  Permissions Summary
                </p>
                <div class="flex flex-wrap gap-2">
                  <span
                    class="px-2 py-1 bg-background-light dark:bg-slate-700 rounded text-xs border border-primary/5"
                    >Approve Donations</span
                  >
                  <span
                    class="px-2 py-1 bg-background-light dark:bg-slate-700 rounded text-xs border border-primary/5"
                    >Financial Auditing</span
                  >
                </div>
              </div>
            </div>
            <!-- Matrimony Admin Card -->
            <div
              class="bg-white dark:bg-slate-800/50 rounded-xl overflow-hidden shadow-sm border border-primary/5"
            >
              <div
                class="p-4 border-b border-primary/5 flex justify-between items-start"
              >
                <div class="flex gap-4 items-center">
                  <div
                    class="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary"
                    data-alt="Traditional wedding knot or heart icon"
                  >
                    <span class="material-symbols-outlined text-2xl"
                      >favorite</span
                    >
                  </div>
                  <div>
                    <h3 class="font-bold text-lg">Matrimony Admin</h3>
                    <p class="text-sm text-slate-500">
                      Profile verification &amp; matching
                    </p>
                  </div>
                </div>
                <button
                  class="px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-lg flex items-center gap-2"
                >
                  <span class="material-symbols-outlined text-sm">edit</span>
                  Edit
                </button>
              </div>
              <div class="p-4">
                <p class="text-xs font-bold text-slate-400 uppercase mb-3">
                  Permissions Summary
                </p>
                <div class="flex flex-wrap gap-2">
                  <span
                    class="px-2 py-1 bg-background-light dark:bg-slate-700 rounded text-xs border border-primary/5"
                    >Profile Verification</span
                  >
                  <span
                    class="px-2 py-1 bg-background-light dark:bg-slate-700 rounded text-xs border border-primary/5"
                    >Private Messaging</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="mt-8">
            <h2 class="text-lg font-bold mb-4">Quick Permission Reference</h2>
            <div
              class="bg-white dark:bg-slate-800 rounded-xl p-4 border border-primary/10"
            >
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-primary"
                      >group</span
                    >
                    <span class="text-sm">Manage Members</span>
                  </div>
                  <div
                    class="flex h-5 w-9 items-center rounded-full bg-primary p-1"
                  >
                    <div
                      class="h-3 w-3 translate-x-4 rounded-full bg-white transition"
                    ></div>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-primary"
                      >campaign</span
                    >
                    <span class="text-sm">Create Events</span>
                  </div>
                  <div
                    class="flex h-5 w-9 items-center rounded-full bg-primary p-1"
                  >
                    <div
                      class="h-3 w-3 translate-x-4 rounded-full bg-white transition"
                    ></div>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-primary"
                      >payments</span
                    >
                    <span class="text-sm">Approve Donations</span>
                  </div>
                  <div
                    class="flex h-5 w-9 items-center rounded-full bg-slate-300 dark:bg-slate-600 p-1"
                  >
                    <div class="h-3 w-3 rounded-full bg-white transition"></div>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-primary"
                      >gavel</span
                    >
                    <span class="text-sm">Content Moderation</span>
                  </div>
                  <div
                    class="flex h-5 w-9 items-center rounded-full bg-slate-300 dark:bg-slate-600 p-1"
                  >
                    <div class="h-3 w-3 rounded-full bg-white transition"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <!-- Floating Action Button -->
      <button
        class="fixed bottom-24 right-6 flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 active:scale-95 transition-transform z-20"
      >
        <span class="material-symbols-outlined text-3xl">add</span>
      </button>
      <!-- Bottom Navigation Bar -->
      <nav
        class="fixed bottom-0 left-0 right-0 z-30 border-t border-primary/10 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md px-4 pb-4 pt-2"
      >
        <div class="mx-auto flex max-w-md gap-2">
          <a
            class="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500"
            href="#"
          >
            <span class="material-symbols-outlined">home</span>
            <p class="text-[10px] font-medium leading-none">Home</p>
          </a>
          <a
            class="flex flex-1 flex-col items-center justify-center gap-1 text-primary"
            href="#"
          >
            <span class="material-symbols-outlined">manage_accounts</span>
            <p class="text-[10px] font-medium leading-none">Roles</p>
          </a>
          <a
            class="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500"
            href="#"
          >
            <span class="material-symbols-outlined">group</span>
            <p class="text-[10px] font-medium leading-none">Users</p>
          </a>
          <a
            class="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500"
            href="#"
          >
            <span class="material-symbols-outlined">settings</span>
            <p class="text-[10px] font-medium leading-none">Settings</p>
          </a>
        </div>
      </nav>
    </div>
  </body>
</html>
