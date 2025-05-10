# Contributing to GymTracker Server

Thank you for your interest in contributing to GymTracker! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read it before contributing.

## How to Contribute

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/your-username/GymTracker.git
cd GymTracker/server
```

### 2. Setup Development Environment

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration
```

### 3. Create a Branch

```bash
# Create a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-fix-name
```

### 4. Development Guidelines

#### Code Style
- Follow ESLint configuration
- Use ES Modules syntax
- Follow the existing code structure
- Write meaningful commit messages

#### Commit Message Format
```
type(scope): subject

body

footer
```

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

#### Testing
```bash
# Run tests
npm test

# Run linting
npm run lint
```

### 5. Pull Request Process

1. Update documentation
2. Add tests for new features
3. Ensure all tests pass
4. Update the README.md if needed
5. Create a pull request

### 6. Review Process

- All PRs require at least one review
- CI must pass
- Code must follow style guide
- Tests must pass
- Documentation must be updated

## Development Workflow

### 1. Feature Development

1. Create feature branch
2. Implement feature
3. Write tests
4. Update documentation
5. Create PR

### 2. Bug Fixes

1. Create fix branch
2. Reproduce bug
3. Fix bug
4. Add test
5. Create PR

### 3. Documentation

1. Create docs branch
2. Update documentation
3. Review changes
4. Create PR

## Project Structure

```
server/
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/         # Mongoose models
├── routes/         # API routes
├── config/         # Configuration
├── utils/          # Utility functions
└── tests/          # Test files
```

## Testing Guidelines

### Unit Tests
- Test individual functions
- Mock external dependencies
- Use Jest for testing
- Follow AAA pattern (Arrange, Act, Assert)

### Integration Tests
- Test API endpoints
- Test database operations
- Test authentication
- Test error handling

### Test Coverage
- Aim for >80% coverage
- Cover edge cases
- Test error scenarios
- Test success scenarios

## Documentation Guidelines

### Code Documentation
- Use JSDoc comments
- Document complex logic
- Explain non-obvious code
- Keep comments up to date

### API Documentation
- Document all endpoints
- Include request/response examples
- Document error responses
- Keep documentation in sync with code

## Performance Guidelines

### Code Performance
- Optimize database queries
- Use proper indexing
- Implement caching
- Handle errors properly

### API Performance
- Implement rate limiting
- Use compression
- Optimize response size
- Handle concurrent requests

## Security Guidelines

### Code Security
- Validate input
- Sanitize output
- Use environment variables
- Follow security best practices

### API Security
- Implement authentication
- Use HTTPS
- Set security headers
- Handle sensitive data properly

## Getting Help

- Check existing issues
- Join our Discord server
- Read the documentation
- Ask in discussions

## Recognition

Contributors will be:
- Listed in README.md
- Given credit in release notes
- Invited to join the team
- Given access to premium features

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License. 