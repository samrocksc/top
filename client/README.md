# Client Environment Setup

To run the client application, you need to set up the environment variables in the `.env` file.

## Required Environment Variables

The following environment variables need to be set in your `.env` file:

```bash
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

## Notes

- Authentication has been removed from the frontend
- The application now works without user authentication
- For production, use environment variables provided by your hosting platform