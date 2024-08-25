# Cobalt

![version badge](https://img.shields.io/badge/version-6.0-2573bc)

Cobalt is a versatile platform offering many services to UConn students, including course information, professor ratings, dining hall menus, dorm reviews & imagery, classroom information, rec center traffic, and much more.

## Important Information

This project has been abandoned, and thus both this repository, and the older v4 versions of Cobalt were open sourced.

If you are interested in maintaining this project please contact me at [me@m1ke.co](mailto:me@m1ke.co) or on Discord at ``@notm1ke``. Would love to see this project live on, I've let UConn though and do not have the time anymore.

## Quick Setup

Use npm to install Cobalt's required dependencies.

```bash
npm install
```

## Backplane Service

This project has a API server which must be configured. It is a simple Express.js app used to better separate data concerns between the front and backends. You can find it at [@notm1ke/cobalt-backplane](https://github.com/notm1ke/cobalt-backplane).

## Environment

An example ``.env.example`` is provided in the root of the project, rename it to ``.env`` and configure it with a valid Supabase credentials and the target of the backplane service. 

## Deployment Information

Any commits to ``master`` will be automatically deployed - please be careful when committing to prod/staging environments, and do so only after extensively testing your changes.

After you commit to this repository, you can track your deployment and it's analytics through the [Vercel](https://vercel.com/mike-medved/cobalt-next) website.