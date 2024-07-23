import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  image_url: string = '';
  image: any;
  isLoading: boolean = false;
  constructor(private http: HttpClient) {}

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      try {
        const imageDataUrl = await this.readFileAsDataURL(file);
        // Normal webp data url
        // this.image_url = imageDataUrl

        //converted png image data url
        const pngFile = await this.convertWebpToPng(imageDataUrl);
        this.image_url = await this.readFileAsDataURL(pngFile);
      } catch (error) {
        console.error('Error converting file:', error);
      }
    }
  }

  private readFileAsDataURL(file: File): Promise<string> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  private async convertWebpToPng(webpDataUrl: string): Promise<File> {
    const response = await fetch(webpDataUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch the image');
    }
    const blob = await response.blob();
    const pngFile = new File([blob], 'converted.png', { type: 'image/png' });
    return pngFile;
  }

  // second option using canvas 
  /*
    private async convertWebpToPng(webpDataUrl: string): Promise<File> {
  const img = new Image();
  img.src = webpDataUrl;
  const imageLoadPromise = new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load the image'));
  });

  await imageLoadPromise;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  canvas.width = img.width;
  canvas.height = img.height;

  ctx.drawImage(img, 0, 0);

  const pngDataUrl = canvas.toDataURL('image/png');

  const response = await fetch(pngDataUrl);
  const blob = await response.blob();

  const pngFile = new File([blob], 'converted.png', { type: 'image/png' });
  
  return pngFile;
}
  */
  submit() {}
}
