import { defineMiddleware } from 'astro:middleware';
import { db, Role, User } from 'astro:db';
import { v4 as UUID } from "uuid";
import bcrypt from "bcryptjs";
import { getSession } from 'auth-astro/server';


//import { getSession } from 'auth-astro/server';

const notAuthenticatedRoutes = ['/login', '/register'];

export const onRequest = defineMiddleware(
  async ({ url, locals, redirect, request }, next) => {




    const res = await db.select().from(User);

    if (res.length === 0) {
      const roles = [
        { id: "admin", name: "Admin" },
        { id: "user", name: "User" }
      ];


      const newUser = {
        id: UUID(),
        name: "Jose Antonio",
        email: "prueba@gmail.com",
        password: bcrypt.hashSync("123456"),
        role: 'admin'
      };

      const newUser2 = {
        id: UUID(),
        name: "Jose Antonia",
        email: "prueba2@gmail.com",
        password: bcrypt.hashSync("123456"),
        role: 'user'
      };

      await db.insert(Role).values(roles);

      await db.insert(User).values([newUser, newUser2]);
      console.log("Se ejecuto el seed");
    }



    const session = await getSession(request);
    const isLoggedIn = !!session;
    const user = session?.user;
    // TODO:
    locals.isLoggedIn = isLoggedIn;
    locals.user = null;
    locals.isAdmin = false;

    if (user) {
      // TODO:
      locals.user = {
        // avatar: UserActivation.photoURL ?? '',
        name: user.name!,
        email: user.email!,
        // emailVerified: user.emailVerified,
      };

      locals.isAdmin = user.role === "admin";
    }

    // TODO: Eventualmente tenemos que controlar el acceso por roles
    if (!locals.isAdmin && url.pathname.startsWith('/dashboard')) {
      return redirect('/');
    }

    if (isLoggedIn && notAuthenticatedRoutes.includes(url.pathname)) {
      return redirect('/');
    }

    return next();
  }
);
