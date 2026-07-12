- Stack: Node.js + TypeScript (ESM), Express 4, Mongoose 8 (MongoDB), JWT (jsonwebtoken), Joi validation, bcrypt.
- backend/package.json scripts: start = rimraf dist && tsc-watch --onSuccess "npm run watch:server", watch:server = tsx src/main.ts --watch. No test/lint/build scripts. No engines field. Docker       
  image: node:24-alpine.
- Entry point backend/src/main.ts: express.json(), express.urlencoded(), cors({origin: ["http://localhost:3000"]}), mounts apiRouter at / (no /api prefix in the app itself — nginx adds /api/
  externally, see below), Mongo connect w/ retry loop, listens on config.PORT, JSON error handler.
- backend/src/configs/config.ts loads dotenv.config({ path: "../.env" }) — i.e. the .env file lives at the repo root, one level above backend/.
- Env vars (from root .env.example): PORT, MONGO_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_LIFETIME, JWT_REFRESH_LIFETIME, JWT_ACTIVATE_SECRET, JWT_ACTIVATE_LIFETIME,
  JWT_RECOVERY_SECRET, JWT_RECOVERY_LIFETIME, FRONTEND_URL.
- Router base paths (backend/src/routers/api.router.ts): /auth, /users, /groups, /orders (comments nested under /orders/:id/...).
- Auth model: Bearer access token via checkAccessToken; refresh token in body via checkRefreshToken; isAdmin role gate (RoleEnum: admin, manager); isBlock rejects blocked users; managerValid
  restricts order PATCH/comment-POST to the assigned manager (or lets it be claimed if unassigned).
- Full verified endpoint list (method, path, middleware chain, Joi body/query shape) for Auth, Users, Groups, Orders+Comments — already compiled with exact validator fields:
    - Auth: POST /auth/sign-in {email,password}, POST /auth/refresh {refreshToken}, GET /auth/me, POST /auth/activate/:id (admin), POST /auth/recovery/:id (admin), POST /auth/password/create/:token     
      {password}, POST /auth/password/recovery/:token {password}.
    - Users: GET /users (admin), POST /users (admin) {name,surname,email required}, GET /users/:id (auth only — admin check is commented out in code, note as current behavior), PATCH /users/:id (admin)
      {name?,surname?,email?}, PATCH /users/:id/role-update (admin), PATCH /users/:id/block-unblock (admin).
    - Groups: GET /groups, POST /groups {name required}, GET /groups/:id.
    - Orders: GET /orders (query: pageSize,page,name,surname,email,phone,age,course,course_format,course_type,status,group,manager,order — sortable fields from OrderQueryOrderEnum), GET /orders/excel   
      (same filters, no pagination), POST /orders (public, no auth — lead-capture form) {name?,surname?,email?,phone?,age?,course?,course_format?,course_type?,sum?,already_paid?,utm?,msg?,status?}, GET     
      /orders/:id, PATCH /orders/:id (manager-assignment-restricted), GET /orders/:id/comments, POST /orders/:id (manager-assignment-restricted, creates a comment — note the non-obvious path, it is NOT an  
      order update) {comment required}.
    - Enums to list for reference: CoursesEnum (FS, QACX, JCX, JSCX, FE, PCX), FormatCoursesEnum (static, online), TypeCoursesEnum (pro, minimal, premium, incubator, vip), StatusOrdersEnum (In work,    
      New, Agree, Disagree, Dubbing), RoleEnum (admin, manager).
    - Interactive Swagger/OpenAPI documentation is served by the backend at `/docs` (i.e. **http://localhost:5000/docs/**).
    - Postman collection https://www.dropbox.com/scl/fo/mb7zp2f4kd893dnotqhll/AGVthqTco8mnDUzCxONkq-E?rlkey=nxmu6nvnb2v76twkpdrzwcf1j&dl=0
- Database: MongoDB via Mongoose, connection string from MONGO_URI; no migrations/seeds (schemaless, no Prisma/TypeORM).
