let isDownloading = false;

/**
 * Downloads the resume PDF file directly to disk via Blob URL,
 * ensuring modern browsers save the file directly without opening duplicate tabs.
 * Includes a debounce lock to prevent accidental double-clicks from opening multiple tabs.
 */
export const triggerResumeDownload = (
  resumeUrl: string,
  filename = 'Lekhraj Resume.pdf'
): boolean => {
  if (isDownloading) {
    return false;
  }
  isDownloading = true;
  setTimeout(() => {
    isDownloading = false;
  }, 1200);

  fetch(resumeUrl)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.blob();
    })
    .then((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    })
    .catch((err) => {
      console.error('Error downloading resume:', err);
    });

  return true;
};

