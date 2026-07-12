import type { OpenAPIV3 } from "openapi-types";

const errorSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    status: { type: "integer", example: 400 },
    message: { type: "string", example: "Something went wrong" },
  },
  required: ["status", "message"],
};

const tokenPairSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    accessToken: { type: "string" },
    refreshToken: { type: "string" },
  },
  required: ["accessToken", "refreshToken"],
};

const userSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  description: "Password is never included in API responses.",
  properties: {
    _id: { type: "string" },
    name: { type: "string" },
    surname: { type: "string" },
    email: { type: "string", format: "email" },
    role: { $ref: "#/components/schemas/RoleEnum" },
    isActive: { type: "boolean" },
    blockUser: { type: "boolean" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

const userWithLastLoginSchema: OpenAPIV3.SchemaObject = {
  allOf: [
    { $ref: "#/components/schemas/User" },
    {
      type: "object",
      properties: {
        rowNumber: { type: "integer" },
        lastLogin: {
          type: "string",
          format: "date-time",
          nullable: true,
          description: "Timestamp of the latest issued token, or null.",
        },
      },
    },
  ],
};

const groupSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    _id: { type: "string" },
    name: { type: "string" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

const orderSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    _id: { type: "string" },
    name: { type: "string" },
    surname: { type: "string" },
    email: { type: "string", format: "email" },
    phone: { type: "string" },
    age: { type: "integer" },
    course: { $ref: "#/components/schemas/CoursesEnum" },
    course_format: { $ref: "#/components/schemas/FormatCoursesEnum" },
    course_type: { $ref: "#/components/schemas/TypeCoursesEnum" },
    sum: { type: "number" },
    already_paid: { type: "number" },
    utm: { type: "string" },
    msg: { type: "string" },
    status: { $ref: "#/components/schemas/StatusOrdersEnum" },
    group: {
      type: "string",
      nullable: true,
      description: "ObjectId of the assigned Group.",
    },
    manager: {
      type: "string",
      nullable: true,
      description: "ObjectId of the assigned User (manager).",
    },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

const orderWithIndexSchema: OpenAPIV3.SchemaObject = {
  allOf: [
    { $ref: "#/components/schemas/Order" },
    {
      type: "object",
      properties: {
        rowNumber: {
          type: "integer",
          description: "Row position within the full, unfiltered collection.",
        },
      },
    },
  ],
};

const paginatedOrdersSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    totalItems: { type: "integer" },
    totalPages: { type: "integer" },
    prevPage: { type: "boolean" },
    nextPage: { type: "boolean" },
    data: {
      type: "array",
      items: { $ref: "#/components/schemas/OrderWithIndex" },
    },
  },
};

const commentSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  description: "Raw comment document, returned by the create endpoint.",
  properties: {
    _id: { type: "string" },
    comment: { type: "string" },
    _userId: { type: "string" },
    _idOrder: { type: "string" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

const commentAggregateSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  description:
    "Denormalized comment shape returned by the list endpoint, with the author's name joined in.",
  properties: {
    _id: { type: "string" },
    comment: { type: "string" },
    userName: { type: "string" },
    userSurname: { type: "string" },
    _idOrder: { type: "string" },
    createdAt: { type: "string", format: "date-time" },
  },
};

const orderQueryParameters: OpenAPIV3.ParameterObject[] = [
  {
    name: "name",
    in: "query",
    schema: { type: "string" },
    description: "Filter by lead first name.",
  },
  {
    name: "surname",
    in: "query",
    schema: { type: "string" },
    description: "Filter by lead surname.",
  },
  {
    name: "email",
    in: "query",
    schema: { type: "string" },
    description: "Filter by lead email.",
  },
  {
    name: "phone",
    in: "query",
    schema: { type: "string" },
    description: "Filter by lead phone.",
  },
  {
    name: "age",
    in: "query",
    schema: { type: "integer" },
    description: "Filter by lead age.",
  },
  {
    name: "course",
    in: "query",
    schema: { $ref: "#/components/schemas/CoursesEnum" },
  },
  {
    name: "course_format",
    in: "query",
    schema: { $ref: "#/components/schemas/FormatCoursesEnum" },
  },
  {
    name: "course_type",
    in: "query",
    schema: { $ref: "#/components/schemas/TypeCoursesEnum" },
  },
  {
    name: "status",
    in: "query",
    schema: { $ref: "#/components/schemas/StatusOrdersEnum" },
  },
  {
    name: "group",
    in: "query",
    schema: { type: "string" },
    description: "Filter by group ObjectId.",
  },
  {
    name: "manager",
    in: "query",
    schema: { type: "string" },
    description: "Filter by assigned manager ObjectId.",
  },
  {
    name: "order",
    in: "query",
    schema: { type: "string" },
    description:
      'Sort field, one of the OrderQueryOrderEnum values (`_id`, `name`, `surname`, `email`, `phone`, `age`, `course`, `course_format`, `course_type`, `status`, `sum`, `already_paid`, `created_at`, `group`, `manager`). Prefix with "-" for descending order, e.g. "-created_at".',
  },
];

const idParam: OpenAPIV3.ParameterObject = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "string" },
  description: "MongoDB ObjectId.",
};

const errorResponses = {
  BadRequest: {
    description: "Validation error.",
    content: {
      "application/json": { schema: { $ref: "#/components/schemas/Error" } },
    },
  },
  Unauthorized: {
    description: "Missing, invalid, or expired token.",
    content: {
      "application/json": { schema: { $ref: "#/components/schemas/Error" } },
    },
  },
  Forbidden: {
    description:
      "Insufficient role/permission, blocked account, or not the assigned manager.",
    content: {
      "application/json": { schema: { $ref: "#/components/schemas/Error" } },
    },
  },
  NotFound: {
    description: "Resource not found.",
    content: {
      "application/json": { schema: { $ref: "#/components/schemas/Error" } },
    },
  },
} satisfies Record<string, OpenAPIV3.ResponseObject>;

export const openApiDocument: OpenAPIV3.Document = {
  openapi: "3.0.3",
  info: {
    title: "CRM API",
    version: "1.0.0",
    description:
      "REST API for the CRM lead-management platform: public lead capture, JWT auth, users, groups, orders (leads), and per-order comments. Every error response has the shape `{ status, message }`.",
  },
  servers: [
    { url: "/", description: "Direct backend access (no path prefix)" },
    { url: "/api", description: "Via the nginx reverse proxy" },
  ],
  tags: [
    { name: "Auth" },
    { name: "Users" },
    { name: "Groups" },
    { name: "Orders" },
    { name: "Comments" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          'Access token issued by /auth/sign-in or /auth/refresh, sent as "Authorization: Bearer <token>".',
      },
    },
    schemas: {
      Error: errorSchema,
      TokenPair: tokenPairSchema,
      User: userSchema,
      UserWithLastLogin: userWithLastLoginSchema,
      Group: groupSchema,
      Order: orderSchema,
      OrderWithIndex: orderWithIndexSchema,
      PaginatedOrders: paginatedOrdersSchema,
      Comment: commentSchema,
      CommentAggregate: commentAggregateSchema,
      RoleEnum: {
        type: "string",
        enum: ["admin", "manager"],
      },
      CoursesEnum: {
        type: "string",
        enum: ["FS", "QACX", "JCX", "JSCX", "FE", "PCX"],
      },
      FormatCoursesEnum: {
        type: "string",
        enum: ["static", "online"],
      },
      TypeCoursesEnum: {
        type: "string",
        enum: ["pro", "minimal", "premium", "incubator", "vip"],
      },
      StatusOrdersEnum: {
        type: "string",
        enum: ["In work", "New", "Agree", "Disagree", "Dubbing"],
      },
      SignInRequest: {
        type: "object",
        properties: {
          email: { type: "string", format: "email" },
          password: {
            type: "string",
            minLength: 5,
            maxLength: 15,
          },
        },
        required: ["email", "password"],
      },
      SignInResponse: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/User" },
          tokens: { $ref: "#/components/schemas/TokenPair" },
        },
      },
      RefreshRequest: {
        type: "object",
        properties: { refreshToken: { type: "string" } },
        required: ["refreshToken"],
      },
      RefreshResponse: {
        type: "object",
        properties: { tokens: { $ref: "#/components/schemas/TokenPair" } },
      },
      PasswordActionRequest: {
        type: "object",
        properties: {
          password: { type: "string", minLength: 5, maxLength: 15 },
        },
        required: ["password"],
      },
      PasswordActionResponse: {
        type: "object",
        properties: {
          details: { type: "string", example: "Password activate" },
        },
      },
      UserCreateRequest: {
        type: "object",
        properties: {
          name: { type: "string", maxLength: 10 },
          surname: { type: "string", maxLength: 10 },
          email: { type: "string", format: "email" },
        },
        required: ["name", "surname", "email"],
      },
      UserUpdateRequest: {
        type: "object",
        properties: {
          name: { type: "string", maxLength: 10 },
          surname: { type: "string", maxLength: 10 },
          email: { type: "string", format: "email" },
        },
      },
      GroupCreateRequest: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 2, maxLength: 10 },
        },
        required: ["name"],
      },
      // OrderCreateRequest: {
      //   type: "object",
      //   description:
      //     "All fields are optional; used by the public lead-capture form.",
      //   properties: {
      //     name: { type: "string" },
      //     surname: { type: "string" },
      //     email: { type: "string", format: "email" },
      //     phone: { type: "string" },
      //     age: { type: "integer", minimum: 2, maximum: 100 },
      //     course: { $ref: "#/components/schemas/CoursesEnum" },
      //     course_format: { $ref: "#/components/schemas/FormatCoursesEnum" },
      //     course_type: { $ref: "#/components/schemas/TypeCoursesEnum" },
      //     sum: { type: "number", minimum: 1, maximum: 500000 },
      //     already_paid: { type: "number", minimum: 1, maximum: 500000 },
      //     utm: { type: "string" },
      //     msg: { type: "string", maxLength: 30 },
      //     status: { $ref: "#/components/schemas/StatusOrdersEnum" },
      //   },
      // },
      OrderUpdateRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          surname: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
          age: { type: "integer" },
          course: { $ref: "#/components/schemas/CoursesEnum" },
          course_format: { $ref: "#/components/schemas/FormatCoursesEnum" },
          course_type: { $ref: "#/components/schemas/TypeCoursesEnum" },
          sum: { type: "number" },
          already_paid: { type: "number" },
          status: { $ref: "#/components/schemas/StatusOrdersEnum" },
          group: {
            type: "string",
            nullable: true,
            description: "Group ObjectId, or null to unset.",
          },
        },
      },
      CommentCreateRequest: {
        type: "object",
        properties: {
          comment: { type: "string", minLength: 1, maxLength: 25 },
        },
        required: ["comment"],
      },
    },
  },
  paths: {
    "/auth/sign-in": {
      post: {
        tags: ["Auth"],
        summary: "Sign in with email and password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SignInRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Signed in successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SignInResponse" },
              },
            },
          },
          "400": errorResponses.BadRequest,
          "401": errorResponses.Unauthorized,
        },
      },
    },
    "/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Exchange a refresh token for a new token pair",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RefreshRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "New token pair issued.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RefreshResponse" },
              },
            },
          },
          "403": errorResponses.Forbidden,
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get the currently authenticated user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Current user.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "401": errorResponses.Unauthorized,
          "403": errorResponses.Forbidden,
        },
      },
    },
    "/auth/activate/{id}": {
      post: {
        tags: ["Auth"],
        summary: "Generate an account-activation link for a user (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        responses: {
          "200": {
            description:
              "Activation URL, e.g. `<FRONTEND_URL>/activate/<token>` (returned as a bare JSON string).",
            content: {
              "application/json": { schema: { type: "string" } },
            },
          },
          "400": errorResponses.BadRequest,
          "401": errorResponses.Unauthorized,
          "403": errorResponses.Forbidden,
          "404": errorResponses.NotFound,
        },
      },
    },
    "/auth/recovery/{id}": {
      post: {
        tags: ["Auth"],
        summary: "Generate a password-recovery link for a user (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        responses: {
          "200": {
            description:
              "Recovery URL, e.g. `<FRONTEND_URL>/recovery/<token>` (returned as a bare JSON string).",
            content: {
              "application/json": { schema: { type: "string" } },
            },
          },
          "400": errorResponses.BadRequest,
          "401": errorResponses.Unauthorized,
          "403": errorResponses.Forbidden,
          "404": errorResponses.NotFound,
        },
      },
    },
    "/auth/password/create/{token}": {
      post: {
        tags: ["Auth"],
        summary: "Set the initial password using an activation token",
        parameters: [
          {
            name: "token",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Signed JWT_ACTIVATE token from the activation link.",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PasswordActionRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: 'Password set. `details` is "Password activate".',
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PasswordActionResponse",
                },
              },
            },
          },
          "400": errorResponses.BadRequest,
          "401": errorResponses.Unauthorized,
        },
      },
    },
    "/auth/password/recovery/{token}": {
      post: {
        tags: ["Auth"],
        summary: "Set a new password using a recovery token",
        parameters: [
          {
            name: "token",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Signed JWT_RECOVERY token from the recovery link.",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PasswordActionRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: 'Password reset. `details` is "Password recovery".',
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PasswordActionResponse",
                },
              },
            },
          },
          "400": errorResponses.BadRequest,
          "401": errorResponses.Unauthorized,
        },
      },
    },
    "/users": {
      get: {
        tags: ["Users"],
        summary: "List all users (admin only)",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Array of users, including last-login timestamp.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/UserWithLastLogin" },
                },
              },
            },
          },
          "401": errorResponses.Unauthorized,
          "403": errorResponses.Forbidden,
        },
      },
      post: {
        tags: ["Users"],
        summary: "Create a user (admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserCreateRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "User created.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "400": errorResponses.BadRequest,
          "401": errorResponses.Unauthorized,
          "403": errorResponses.Forbidden,
        },
      },
    },
    "/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get a user by id",
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        responses: {
          "200": {
            description: "The user.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "400": errorResponses.BadRequest,
          "401": errorResponses.Unauthorized,
          "403": errorResponses.Forbidden,
          "404": errorResponses.NotFound,
        },
      },
      patch: {
        tags: ["Users"],
        summary: "Update a user (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserUpdateRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated user.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "400": errorResponses.BadRequest,
          "401": errorResponses.Unauthorized,
          "403": errorResponses.Forbidden,
          "404": errorResponses.NotFound,
        },
      },
    },
    "/users/{id}/role-update": {
      patch: {
        tags: ["Users"],
        summary: "Toggle a user's role between admin and manager (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        responses: {
          "200": {
            description: "User with toggled role.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "400": errorResponses.BadRequest,
          "401": errorResponses.Unauthorized,
          "403": errorResponses.Forbidden,
        },
      },
    },
    "/users/{id}/block-unblock": {
      patch: {
        tags: ["Users"],
        summary:
          "Toggle a user's blocked status (admin only, cannot block self)",
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        responses: {
          "200": {
            description: "User with toggled blockUser flag.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "400": errorResponses.BadRequest,
          "401": errorResponses.Unauthorized,
          "403": {
            description:
              "Insufficient permission, blocked account, or attempting to block your own account.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/groups": {
      get: {
        tags: ["Groups"],
        summary: "List all groups",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Array of groups.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Group" },
                },
              },
            },
          },
          "401": errorResponses.Unauthorized,
          "403": errorResponses.Forbidden,
        },
      },
      post: {
        tags: ["Groups"],
        summary: "Create a group",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/GroupCreateRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Group created.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Group" },
              },
            },
          },
          "400": errorResponses.BadRequest,
          "401": errorResponses.Unauthorized,
          "403": errorResponses.Forbidden,
        },
      },
    },
    "/groups/{id}": {
      get: {
        tags: ["Groups"],
        summary: "Get a group by id",
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        responses: {
          "200": {
            description: "The group.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Group" },
              },
            },
          },
          "400": errorResponses.BadRequest,
          "401": errorResponses.Unauthorized,
          "403": errorResponses.Forbidden,
          "404": errorResponses.NotFound,
        },
      },
    },
    "/orders": {
      get: {
        tags: ["Orders"],
        summary: "List orders (paginated, filterable, sortable)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "pageSize",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 25 },
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 1 },
          },
          ...orderQueryParameters,
        ],
        responses: {
          "200": {
            description: "Paginated list of orders.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PaginatedOrders" },
              },
            },
          },
          "400": errorResponses.BadRequest,
          "401": errorResponses.Unauthorized,
          "403": errorResponses.Forbidden,
        },
      },
      // post: {
      //   tags: ["Orders"],
      //   summary: "Create an order (public lead-capture form, no auth required)",
      //   requestBody: {
      //     required: true,
      //     content: {
      //       "application/json": {
      //         schema: { $ref: "#/components/schemas/OrderCreateRequest" },
      //       },
      //     },
      //   },
      //   responses: {
      //     "201": {
      //       description: "Order created.",
      //       content: {
      //         "application/json": {
      //           schema: { $ref: "#/components/schemas/Order" },
      //         },
      //       },
      //     },
      //     "400": errorResponses.BadRequest,
      //   },
      // },
    },
    "/orders/excel": {
      get: {
        tags: ["Orders"],
        summary:
          "List all matching orders for Excel export (same filters as /orders, no pagination)",
        security: [{ bearerAuth: [] }],
        parameters: orderQueryParameters,
        responses: {
          "200": {
            description: "Array of matching orders.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/OrderWithIndex" },
                },
              },
            },
          },
          "400": errorResponses.BadRequest,
          "401": errorResponses.Unauthorized,
          "403": errorResponses.Forbidden,
        },
      },
    },
    "/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Get an order by id",
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        responses: {
          "200": {
            description: "The order.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Order" },
              },
            },
          },
          "400": errorResponses.BadRequest,
          "401": errorResponses.Unauthorized,
          "403": errorResponses.Forbidden,
          "404": errorResponses.NotFound,
        },
      },
      patch: {
        tags: ["Orders"],
        summary:
          "Update an order (restricted to the assigned manager, if one is set)",
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/OrderUpdateRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated order.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Order" },
              },
            },
          },
          "400": errorResponses.BadRequest,
          "401": errorResponses.Unauthorized,
          "403": errorResponses.Forbidden,
          "404": errorResponses.NotFound,
        },
      },
      post: {
        tags: ["Comments"],
        summary:
          "Add a comment to an order (restricted to the assigned manager, if one is set)",
        description:
          'Note the path: this is "POST /orders/{id}", not "/orders/{id}/comments" — it creates a comment on the order identified by {id}.',
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CommentCreateRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Comment created.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Comment" },
              },
            },
          },
          "400": errorResponses.BadRequest,
          "401": errorResponses.Unauthorized,
          "403": errorResponses.Forbidden,
          "404": errorResponses.NotFound,
        },
      },
    },
    "/orders/{id}/comments": {
      get: {
        tags: ["Comments"],
        summary: "List comments on an order",
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        responses: {
          "200": {
            description:
              "Array of comments with author name/surname joined in.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/CommentAggregate" },
                },
              },
            },
          },
          "401": errorResponses.Unauthorized,
          "403": errorResponses.Forbidden,
          "404": errorResponses.NotFound,
        },
      },
    },
  },
};
