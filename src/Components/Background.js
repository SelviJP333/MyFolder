const MyBackgroundTask = async () => {
    try {
      // Your background task logic here
      
      // Do some asynchronous work, such as making an API call or processing data
      await fetch('https://example.com/api');
      
    } catch (error) {
      console.error('Background task error:', error);
    }
  };
  
  export default MyBackgroundTask;