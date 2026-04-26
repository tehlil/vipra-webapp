// import { createServerClient } from "@supabase/ssr";
// import { cookies } from "next/headers";

// export function createClient() {
//   const cookieStore = cookies();

//   console.log("ENV URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
//   console.log("ENV KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

//   if (
//     !process.env.NEXT_PUBLIC_SUPABASE_URL ||
//     !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
//   ) {
//     throw new Error("Supabase ENV variables are missing");
//   }

//   return createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
//     {
//       cookies: {
//         getAll() {
//           return cookieStore.getAll();
//         },
//         setAll(cookiesToSet: any[]) {
//           try {
//             cookiesToSet.forEach(({ name, value, options }) => {

//               (cookieStore as any).set(name, value, options);
//             });
//           } catch {

//           }
//         },
//       },
//     },
//   );
// }

// export async function getUser() {
//   try {
//     const supabase = createClient();

//     const {
//       data: { user },
//       error,
//     } = await supabase.auth.getUser();

//     if (error) {
//       console.error("Error fetching user:", error.message);
//       return null;
//     }

//     return user;
//   } catch (err) {
//     console.error("Supabase error:", err);
//     return null;
//   }
// }

// export async function getUserProfile() {
//   try {
//     const supabase = createClient();
//     const user = await getUser();

//     if (!user) return null;

//     const { data, error } = await supabase
//       .from("users")
//       .select("*")
//       .eq("auth_id", user.id)
//       .single();

//     if (error) {
//       console.error("Error fetching profile:", error.message);
//       return null;
//     }

//     return data;
//   } catch (err) {
//     console.error("Profile error:", err);
//     return null;
//   }
// }

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  console.log("ENV URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("ENV KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    throw new Error("Supabase ENV variables are missing");
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // ignore in server components
          }
        },
      },
    },
  );
}

export async function getUser() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Error fetching user:", error.message);
      return null;
    }

    return user;
  } catch (err) {
    console.error("Supabase error:", err);
    return null;
  }
}

export async function getUserProfile() {
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Profile error:", err);
    return null;
  }
}
