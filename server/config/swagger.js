const swaggerJsdoc = require('swagger-jsdoc');
const { version } = require('../package.json');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie Database API',
      version,
      description:
        'A full-stack movie database REST API powered by TMDB. Browse trending, popular, and top-rated movies & TV shows, manage favorites and watchlist with JWT authentication.',
      contact: {
        name: 'Serkanby',
        url: 'https://serkanbayraktar.com/',
      },
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development' },
    ],
    tags: [
      { name: 'Auth', description: 'User authentication & profile management' },
      { name: 'Lists', description: 'Favorites & watchlist management' },
      { name: 'Movies', description: 'TMDB movie & TV show proxy endpoints' },
      { name: 'Health', description: 'Server health check' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '664f1a2b3c4d5e6f7a8b9c0d' },
            username: { type: 'string', example: 'johndoe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            avatar: { type: 'string', example: 'https://example.com/avatar.jpg' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        MovieItem: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '664f1a2b3c4d5e6f7a8b9c0e' },
            userId: { type: 'string', example: '664f1a2b3c4d5e6f7a8b9c0d' },
            movieId: { type: 'integer', example: 550 },
            movieTitle: { type: 'string', example: 'Fight Club' },
            posterPath: { type: 'string', example: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
            mediaType: { type: 'string', enum: ['movie', 'tv'], example: 'movie' },
            listType: { type: 'string', enum: ['favorite', 'watchlist'], example: 'favorite' },
            voteAverage: { type: 'number', example: 8.4 },
            releaseDate: { type: 'string', example: '1999-10-15' },
            addedAt: { type: 'string', format: 'date-time' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Please provide a valid email' },
                },
              },
            },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Authentication required or token invalid',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { success: false, message: 'Not authorized, no token' },
            },
          },
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ValidationError' },
            },
          },
        },
        TooManyRequests: {
          description: 'Rate limit exceeded',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { success: false, message: 'Too many requests, please try again later' },
            },
          },
        },
      },
    },
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          description: 'Create a new user account with username, email, and password. Returns JWT token on success.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'email', 'password'],
                  properties: {
                    username: { type: 'string', minLength: 2, maxLength: 30, example: 'johndoe' },
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    password: { type: 'string', minLength: 6, example: 'mypassword123' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          user: { $ref: '#/components/schemas/User' },
                          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Email or username already taken / Validation error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                  example: { success: false, message: 'Email is already taken' },
                },
              },
            },
            429: { $ref: '#/components/responses/TooManyRequests' },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login user',
          description: 'Authenticate with email and password. Returns JWT token on success.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    password: { type: 'string', example: 'mypassword123' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          user: { $ref: '#/components/schemas/User' },
                          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Invalid credentials',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                  example: { success: false, message: 'Invalid email or password' },
                },
              },
            },
            429: { $ref: '#/components/responses/TooManyRequests' },
          },
        },
      },
      '/api/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current user',
          description: 'Retrieve the currently authenticated user profile.',
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: 'Current user data',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          user: { $ref: '#/components/schemas/User' },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
      },
      '/api/auth/profile': {
        put: {
          tags: ['Auth'],
          summary: 'Update user profile',
          description: 'Update the authenticated user\'s username and/or avatar URL.',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    username: { type: 'string', minLength: 2, maxLength: 30, example: 'newusername' },
                    avatar: { type: 'string', format: 'uri', example: 'https://example.com/avatar.jpg' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Profile updated',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          user: { $ref: '#/components/schemas/User' },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            422: { $ref: '#/components/responses/ValidationError' },
          },
        },
      },
      '/api/auth/change-password': {
        put: {
          tags: ['Auth'],
          summary: 'Change password',
          description: 'Change the authenticated user\'s password. Returns a new JWT token.',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['currentPassword', 'newPassword'],
                  properties: {
                    currentPassword: { type: 'string', example: 'oldpassword123' },
                    newPassword: { type: 'string', minLength: 6, example: 'newpassword456' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Password changed, new token issued',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Current password incorrect',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                  example: { success: false, message: 'Current password is incorrect' },
                },
              },
            },
          },
        },
      },
      '/api/auth/account': {
        delete: {
          tags: ['Auth'],
          summary: 'Delete account',
          description: 'Permanently delete the authenticated user\'s account and all associated data (favorites, watchlist).',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['password'],
                  properties: {
                    password: { type: 'string', example: 'mypassword123' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Account deleted',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Account deleted successfully' },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Password incorrect',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                  example: { success: false, message: 'Password is incorrect' },
                },
              },
            },
          },
        },
      },
      '/api/list/status/{movieId}': {
        get: {
          tags: ['Lists'],
          summary: 'Check list status',
          description: 'Check if a movie/TV show is in the user\'s favorite and/or watchlist.',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'movieId',
              in: 'path',
              required: true,
              schema: { type: 'integer', minimum: 1 },
              example: 550,
              description: 'TMDB movie/TV show ID',
            },
          ],
          responses: {
            200: {
              description: 'List status',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          isFavorite: { type: 'boolean', example: true },
                          isWatchlist: { type: 'boolean', example: false },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
      },
      '/api/list/{listType}': {
        get: {
          tags: ['Lists'],
          summary: 'Get list items',
          description: 'Retrieve paginated items from the user\'s favorite or watchlist.',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'listType',
              in: 'path',
              required: true,
              schema: { type: 'string', enum: ['favorite', 'watchlist'] },
              description: 'Type of list to retrieve',
            },
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1, minimum: 1 },
              description: 'Page number',
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 20, minimum: 1, maximum: 50 },
              description: 'Items per page',
            },
          ],
          responses: {
            200: {
              description: 'List items retrieved',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          items: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/MovieItem' },
                          },
                          page: { type: 'integer', example: 1 },
                          totalPages: { type: 'integer', example: 3 },
                          total: { type: 'integer', example: 45 },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid list type',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
      },
      '/api/list': {
        post: {
          tags: ['Lists'],
          summary: 'Add to list',
          description: 'Add a movie or TV show to the user\'s favorite or watchlist.',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['movieId', 'movieTitle', 'mediaType', 'listType'],
                  properties: {
                    movieId: { type: 'integer', minimum: 1, example: 550 },
                    movieTitle: { type: 'string', maxLength: 200, example: 'Fight Club' },
                    posterPath: { type: 'string', example: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
                    mediaType: { type: 'string', enum: ['movie', 'tv'], example: 'movie' },
                    listType: { type: 'string', enum: ['favorite', 'watchlist'], example: 'favorite' },
                    voteAverage: { type: 'number', minimum: 0, maximum: 10, example: 8.4 },
                    releaseDate: { type: 'string', example: '1999-10-15' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Added to list',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/MovieItem' },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Already in list / Invalid type / Validation error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                  example: { success: false, message: 'Movie already in your favorite list' },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
      },
      '/api/list/{listType}/{movieId}': {
        delete: {
          tags: ['Lists'],
          summary: 'Remove from list',
          description: 'Remove a movie or TV show from the user\'s favorite or watchlist.',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'listType',
              in: 'path',
              required: true,
              schema: { type: 'string', enum: ['favorite', 'watchlist'] },
              description: 'Type of list',
            },
            {
              name: 'movieId',
              in: 'path',
              required: true,
              schema: { type: 'integer', minimum: 1 },
              example: 550,
              description: 'TMDB movie/TV show ID',
            },
          ],
          responses: {
            200: {
              description: 'Removed from list',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Removed from favorite list' },
                    },
                  },
                },
              },
            },
            404: {
              description: 'Movie not found in list',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                  example: { success: false, message: 'Movie not found in your favorite list' },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
      },
      '/api/movies/trending': {
        get: {
          tags: ['Movies'],
          summary: 'Get trending content',
          description: 'Fetch trending movies and TV shows from TMDB. Supports daily and weekly time windows.',
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1, minimum: 1, maximum: 500 },
              description: 'Page number (1-500)',
            },
            {
              name: 'timeWindow',
              in: 'query',
              schema: { type: 'string', enum: ['day', 'week'], default: 'week' },
              description: 'Time window for trending',
            },
          ],
          responses: {
            200: {
              description: 'Trending results',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          results: { type: 'array', items: { type: 'object' } },
                          page: { type: 'integer', example: 1 },
                          total_pages: { type: 'integer', example: 500 },
                          total_results: { type: 'integer', example: 10000 },
                        },
                      },
                    },
                  },
                },
              },
            },
            429: { $ref: '#/components/responses/TooManyRequests' },
            502: {
              description: 'TMDB API error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                  example: { success: false, message: 'Failed to fetch data from TMDB' },
                },
              },
            },
          },
        },
      },
      '/api/movies/search': {
        get: {
          tags: ['Movies'],
          summary: 'Search movies & TV shows',
          description: 'Search TMDB for movies and TV shows by keyword. Filters out person results.',
          parameters: [
            {
              name: 'query',
              in: 'query',
              required: true,
              schema: { type: 'string' },
              example: 'Inception',
              description: 'Search keyword',
            },
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1, minimum: 1, maximum: 500 },
              description: 'Page number',
            },
          ],
          responses: {
            200: {
              description: 'Search results',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          results: { type: 'array', items: { type: 'object' } },
                          page: { type: 'integer' },
                          total_pages: { type: 'integer' },
                          total_results: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Missing search query',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                  example: { success: false, message: 'Search query is required' },
                },
              },
            },
            429: { $ref: '#/components/responses/TooManyRequests' },
            502: {
              description: 'TMDB API error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/api/movies/popular': {
        get: {
          tags: ['Movies'],
          summary: 'Get popular movies',
          description: 'Fetch the current popular movies from TMDB.',
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1, minimum: 1, maximum: 500 },
              description: 'Page number',
            },
          ],
          responses: {
            200: {
              description: 'Popular movies',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          results: { type: 'array', items: { type: 'object' } },
                          page: { type: 'integer' },
                          total_pages: { type: 'integer' },
                          total_results: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
            429: { $ref: '#/components/responses/TooManyRequests' },
            502: {
              description: 'TMDB API error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/api/movies/top-rated': {
        get: {
          tags: ['Movies'],
          summary: 'Get top rated movies',
          description: 'Fetch the highest-rated movies from TMDB.',
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1, minimum: 1, maximum: 500 },
              description: 'Page number',
            },
          ],
          responses: {
            200: {
              description: 'Top rated movies',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          results: { type: 'array', items: { type: 'object' } },
                          page: { type: 'integer' },
                          total_pages: { type: 'integer' },
                          total_results: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
            429: { $ref: '#/components/responses/TooManyRequests' },
            502: {
              description: 'TMDB API error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/api/movies/{mediaType}/{id}': {
        get: {
          tags: ['Movies'],
          summary: 'Get movie/TV show details',
          description: 'Fetch detailed information for a specific movie or TV show, including credits, videos, and similar titles.',
          parameters: [
            {
              name: 'mediaType',
              in: 'path',
              required: true,
              schema: { type: 'string', enum: ['movie', 'tv'] },
              description: 'Media type',
            },
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer', minimum: 1 },
              example: 550,
              description: 'TMDB ID',
            },
          ],
          responses: {
            200: {
              description: 'Movie/TV show details with credits, videos, and similar',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { type: 'object' },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid media type or ID',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            429: { $ref: '#/components/responses/TooManyRequests' },
            502: {
              description: 'TMDB API error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/api/movies/{mediaType}/{id}/credits': {
        get: {
          tags: ['Movies'],
          summary: 'Get movie/TV show credits',
          description: 'Fetch cast and crew information for a specific movie or TV show.',
          parameters: [
            {
              name: 'mediaType',
              in: 'path',
              required: true,
              schema: { type: 'string', enum: ['movie', 'tv'] },
              description: 'Media type',
            },
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer', minimum: 1 },
              example: 550,
              description: 'TMDB ID',
            },
          ],
          responses: {
            200: {
              description: 'Credits (cast & crew)',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { type: 'object' },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid media type or ID',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            429: { $ref: '#/components/responses/TooManyRequests' },
            502: {
              description: 'TMDB API error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/api/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check',
          description: 'Check if the server is running and healthy.',
          responses: {
            200: {
              description: 'Server is running',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Server is running' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
