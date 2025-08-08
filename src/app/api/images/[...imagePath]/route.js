import { buildImagorUrl } from "@/lib/imagor";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const imagePathWithParams = params.imagePath.join('/');
  
  // A simple regex to extract params and the actual image path
  // Example: 256x256/smart/filters:quality(85)/avatars/path/to/image.jpg
  const regex = /(?:(\d+x\d+)\/)?(?:(smart)\/)?(?:(filters:[^/]+)\/)?(.+)/;
  const matches = imagePathWithParams.match(regex);

  if (!matches) {
    return new NextResponse("Invalid image path format", { status: 400 });
  }

  const [, size, smart, filtersStr, imagePath] = matches;

  const options = {
    width: 0,
    height: 0,
    smart: smart === 'smart',
    filters: filtersStr ? filtersStr.replace('filters:', '').split(':') : [],
  };

  if (size) {
    const [width, height] = size.split('x').map(Number);
    options.width = width;
    options.height = height;
  }

  const signedUrl = buildImagorUrl(imagePath, options);

  if (!signedUrl) {
    return new NextResponse("Could not generate signed URL", { status: 500 });
  }

  // Redirect the client to the actual signed Imagor URL
  return NextResponse.redirect(signedUrl, 307);
}
