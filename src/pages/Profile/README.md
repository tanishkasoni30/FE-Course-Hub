# Profile Component

## Overview
The Profile component displays user-specific information based on their role (student or instructor). It provides a comprehensive view of user details, courses, and performance metrics.

## Features

### For Instructors:
- **Personal Information**: Name, email, role, and join date
- **Statistics Cards**: 
  - Total courses created
  - Total students enrolled
  - Average rating across all courses
  - Total revenue generated
- **Created Courses**: List of all courses with details like title, description, category, level, price, and student count
- **Course Reviews**: All reviews received for their courses with ratings and comments
- **Performance Overview**: Visual progress bars for course completion rate and student satisfaction

### For Students:
- **Personal Information**: Name, email, role, and join date
- **Statistics**: Number of courses enrolled
- **Enrolled Courses**: List of purchased courses with continue learning buttons
- **Learning Progress**: Progress tracking for course completion and learning streaks

## Usage

The Profile component is automatically accessible via the navbar dropdown menu when a user is logged in. Users can click on their profile picture/name in the navbar and select "Profile" to view their profile page.

## API Endpoints Used

- `GET /api/users/:id` - Get user details
- `GET /api/courses/instructor/:instructorId` - Get courses by instructor
- `GET /api/courses/:id/reviews` - Get reviews for a specific course
- `GET /api/users/:id/purchased-courses` - Get student's purchased courses

## Styling

The component uses:
- Bootstrap components for layout and UI elements
- Custom CSS for enhanced visual appeal
- Responsive design for mobile and desktop
- Smooth animations and hover effects
- Modern gradient backgrounds and card designs

## Dependencies

- React Bootstrap
- React Icons
- Axios for API calls
- Custom CSS for styling

## Future Enhancements

- Real-time data updates
- Course analytics charts
- Student progress tracking
- Revenue analytics for instructors
- Course completion certificates
- Learning path recommendations
