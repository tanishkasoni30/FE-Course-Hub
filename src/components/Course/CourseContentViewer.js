import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Button } from 'react-bootstrap';

const CourseContentViewer = ({ course, user }) => {
  useEffect(() => {
    if (course.pdfFile) {
      console.log('PDF File Info:', course.pdfFile);
      console.log('PDF File Path:', course.pdfFile.filePath);
      console.log('Full URL:', `${window.location.origin}${course.pdfFile.filePath}`);
    }
  }, [course.pdfFile]);

  const [activeTab, setActiveTab] = useState('video');

  // Debug: Log PDF file information
  
  const extractVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = extractVideoId(course.youtubeVideoUrl);

  const handleTabSelect = (key) => {
    setActiveTab(key);
  };

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <Card className="dashboard-card">
            <Card.Header>
              <h3>Course Content</h3>
              <p className="mb-0 text-muted">
                {course.instructor && course.instructor._id === user._id 
                  ? "Your course content and materials - You can edit this course anytime" 
                  : "Access your purchased course materials"
                }
              </p>
            </Card.Header>
            <Card.Body>
              <Tabs 
                activeKey={activeTab} 
                onSelect={handleTabSelect}
                className="mb-3"
              >
                <Tab eventKey="video" title="📹 Video Lecture">
                  <div className="video-container mb-4">
                    {videoId ? (
                      <div className="ratio ratio-16x9">
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title="Course Video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="rounded"
                        ></iframe>
                      </div>
                    ) : (
                      <div className="alert alert-warning">
                        <h5>Video Not Available</h5>
                        <p>YouTube video URL is not properly configured for this course.</p>
                        {course.youtubeVideoUrl && (
                          <small className="text-muted">
                            Current URL: {course.youtubeVideoUrl}
                          </small>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="video-info">
                    <h5>{course.title}</h5>
                    <p className="text-muted">
                      Watch the complete video lecture to understand the course concepts.
                    </p>
                  </div>
                </Tab>

                <Tab eventKey="pdf" title="📄 Course Notes">
                  <div className="pdf-container">
                    <div className="text-center mb-4">
                      <h5>Course Notes & Materials</h5>
                      <p className="text-muted">
                        Access your course notes and downloadable materials
                      </p>
                    </div>

                                         {course.pdfFile && course.pdfFile.filePath ? (
                       <div className="pdf-viewer">
                         <div className="text-center mb-3">
                           <Button
                             variant="primary"
                             href={course.pdfFile.filePath}
                             target="_blank"
                             className="me-3"
                           >
                             📖 View PDF Online
                           </Button>
                           <Button
                             variant="success"
                             href={course.pdfFile.filePath}
                             download={course.pdfFile.originalName}
                           >
                             📥 Download PDF
                           </Button>
                           <Button
                             variant="info"
                             href={`/test-pdf/${course.pdfFile.filename}`}
                             target="_blank"
                             className="ms-2"
                           >
                             🔍 Test PDF Access
                           </Button>
                         </div>
                         
                         <div className="pdf-iframe-container">
                           <iframe
                             src={`${course.pdfFile.filePath}#toolbar=1&navpanes=1&scrollbar=1`}
                             title="Course PDF"
                             width="100%"
                             height="600px"
                             frameBorder="0"
                             className="border rounded"
                             onLoad={() => console.log('PDF iframe loaded successfully')}
                             onError={(e) => {
                               console.error('PDF iframe error:', e);
                             }}
                           >
                             <p>Your browser does not support iframes. 
                               <a href={course.pdfFile.filePath} target="_blank" rel="noopener noreferrer">
                                 Click here to view the PDF
                               </a>
                             </p>
                           </iframe>
                         </div>
                         
                         {/* Fallback PDF viewer for better compatibility */}
                         <div className="mt-3 text-center">
                           <small className="text-muted">
                             If the PDF doesn't display above, use the "View PDF Online" button to open it in a new tab.
                           </small>
                           <div className="mt-2">
                             <small className="text-info">
                               <strong>Debug Info:</strong> PDF Path: {course.pdfFile.filePath}
                             </small>
                           </div>
                         </div>
                       </div>
                     ) : (
                      <div className="alert alert-info text-center py-5">
                        <h5>PDF Not Available</h5>
                        <p>Course notes PDF is not available at the moment.</p>
                        <small className="text-muted">
                          Please contact the instructor if you need the course materials.
                        </small>
                      </div>
                    )}

                                         {course.notes && (
                       <div className="course-notes mt-4">
                         <h6 className="mb-3">Additional Notes:</h6>
                         <div className="p-4 bg-light rounded border">
                           <div className="notes-content">
                             {course.notes.split('\n').map((line, index) => (
                               <p key={index} className="mb-2">
                                 {line.trim() || '\u00A0'}
                               </p>
                             ))}
                           </div>
                         </div>
                       </div>
                     )}
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CourseContentViewer;
