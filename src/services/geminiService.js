import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI with proper error handling
const getGeminiClient = () => {
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  
  if (!API_KEY) {
    throw new Error("Gemini API key not found. Please set REACT_APP_GEMINI_API_KEY in your .env file");
  }
  
  if (API_KEY === "YOUR_API_KEY_HERE" || API_KEY.length < 20) {
    throw new Error("Invalid API key. Please check your .env file");
  }
  
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  } catch (error) {
    console.error("Error initializing Gemini:", error);
    throw new Error("Failed to initialize Gemini AI client");
  }
};

// Course Recommendation Service
export const getCourseRecommendations = async (userInterests, userLevel, userGoals) => {
  try {
    const model = getGeminiClient();
    
    const prompt = `
      As an AI course advisor, recommend 5 courses based on the following criteria:
      
      User Interests: ${userInterests}
      User Level: ${userLevel}
      User Goals: ${userGoals}
      
      Please provide:
      1. Course titles
      2. Brief descriptions
      3. Why these courses are recommended
      4. Learning path suggestions
      
      Format the response in a structured way that's easy to read.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting course recommendations:', error);
    
    if (error.message.includes('API key')) {
      throw new Error('Please check your Gemini API key configuration');
    } else if (error.message.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later.');
    } else {
      throw new Error('Failed to get AI recommendations. Please try again.');
    }
  }
};

// Course Content Generation Service
export const generateCourseContent = async (courseTitle, courseDescription, targetAudience) => {
  try {
    const model = getGeminiClient();
    
    const prompt = `
      As an expert course creator, help me develop content for this course:
      
      Course Title: ${courseTitle}
      Course Description: ${courseDescription}
      Target Audience: ${targetAudience}
      
      Please provide:
      1. Detailed course outline with modules
      2. Learning objectives for each module
      3. Key topics to cover
      4. Suggested duration for each module
      5. Practical exercises or projects
      6. Assessment methods
      
      Make it comprehensive and actionable for instructors.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating course content:', error);
    throw new Error('Failed to generate course content');
  }
};

// Learning Path Generation
export const generateLearningPath = async (skill, currentLevel, targetLevel, timeAvailable) => {
  try {
    const model = getGeminiClient();
    
    const prompt = `
      Create a personalized learning path for:
      
      Skill: ${skill}
      Current Level: ${currentLevel}
      Target Level: ${targetLevel}
      Time Available: ${timeAvailable}
      
      Please provide:
      1. Step-by-step learning progression
      2. Recommended courses in order
      3. Time estimates for each step
      4. Milestones and checkpoints
      5. Tips for staying motivated
      
      Make it practical and achievable.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating learning path:', error);
    throw new Error('Failed to generate learning path');
  }
};

// Study Tips and Advice
export const getStudyTips = async (subject, studyStyle, timeConstraints) => {
  try {
    const model = getGeminiClient();
    
    const prompt = `
      Provide personalized study tips for:
      
      Subject: ${subject}
      Study Style: ${studyStyle}
      Time Constraints: ${timeConstraints}
      
      Please include:
      1. Effective study techniques
      2. Time management strategies
      3. Memory retention tips
      4. Practice exercises
      5. Common pitfalls to avoid
      
      Make it practical and tailored to the user's situation.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting study tips:', error);
    throw new Error('Failed to get study tips');
  }
};

// Course Description Enhancement
export const enhanceCourseDescription = async (basicDescription, courseType, targetAudience) => {
  try {
    const model = getGeminiClient();
    
    const prompt = `
      Enhance this course description to make it more engaging and informative:
      
      Basic Description: ${basicDescription}
      Course Type: ${courseType}
      Target Audience: ${targetAudience}
      
      Please:
      1. Make it more compelling
      2. Add clear learning outcomes
      3. Include what students will gain
      4. Add engaging language
      5. Keep it concise but informative
      
      Return only the enhanced description.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error enhancing course description:', error);
    throw new Error('Failed to enhance course description');
  }
};

// AI Chat Assistant
export const chatWithAI = async (message, conversationHistory = []) => {
  try {
    const model = getGeminiClient();
    
    let prompt = `You are an AI learning assistant for CourseHub, a course selling platform. 
    Help users with their learning questions, course recommendations, and study advice.
    
    Previous conversation:
    ${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
    
    Current user message: ${message}
    
    Please provide a helpful, friendly response that guides the user in their learning journey.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in AI chat:', error);
    
    if (error.message.includes('API key')) {
      throw new Error('Please check your Gemini API key configuration');
    } else if (error.message.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later.');
    } else {
      throw new Error('Failed to get AI response. Please try again.');
    }
  }
};

export default {
  getCourseRecommendations,
  generateCourseContent,
  generateLearningPath,
  getStudyTips,
  enhanceCourseDescription,
  chatWithAI
};
