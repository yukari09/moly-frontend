'use client';

import Image from 'next/image';

// Recursive component to render list items and their potential nested lists
const ListItem = ({ item }) => {
    return (
        <li>
            <span dangerouslySetInnerHTML={{ __html: item.content }} />
            {item.items && item.items.length > 0 && (
                <ul>
                    {item.items.map((nestedItem, index) => <ListItem key={index} item={nestedItem} />)}
                </ul>
            )}
        </li>
    );
};

const BlockRenderer = ({ block }) => {
  switch (block.type) {
    case 'header':
      const HeaderTag = `h${block.data.level}`;
      return <HeaderTag dangerouslySetInnerHTML={{ __html: block.data.text }} />;

    case 'paragraph':
      return <p dangerouslySetInnerHTML={{ __html: block.data.text }} />;

    case 'list':
      const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
      return (
        <ListTag>
          {block.data.items.map((item, index) => (
            <ListItem key={index} item={item} />
          ))}
        </ListTag>
      );

    case 'image':
      const width = block.data.file.width || 800;
      const height = block.data.file.height || 600;
      return (
        <figure className="flex flex-col items-center">
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-md"
            style={{ aspectRatio: `${width} / ${height}` }}
          >
            <Image
              src={block.data.file.url}
              alt={block.data.caption || 'Image'}
              fill
              className="object-contain"
            />
          </div>
          {block.data.caption && <figcaption className="mt-2 text-sm text-center text-muted-foreground">{block.data.caption}</figcaption>}
        </figure>
      );

    case 'quote':
      return (
        <blockquote className="relative border-l-4 border-muted-foreground pl-4 italic">
          <p dangerouslySetInnerHTML={{ __html: block.data.text }} className="mb-2"></p>
          {block.data.caption && <footer className="text-sm text-right">- {block.data.caption}</footer>}
        </blockquote>
      );

    case 'code':
        return (
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code dangerouslySetInnerHTML={{ __html: block.data.code }}></code>
            </pre>
        );

    case 'table':
        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    {block.data.withHeadings && (
                        <thead className="bg-muted/50">
                            <tr>
                                {block.data.content[0].map((header, index) => (
                                    <th key={index} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" dangerouslySetInnerHTML={{ __html: header }}></th>
                                ))}
                            </tr>
                        </thead>
                    )}
                    <tbody className="divide-y divide-border">
                        {(block.data.withHeadings ? block.data.content.slice(1) : block.data.content).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm" dangerouslySetInnerHTML={{ __html: cell }}></td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );

    case 'embed':
        return (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe 
                    src={block.data.embed} 
                    className="absolute top-0 left-0 w-full h-full rounded-md" 
                    frameBorder="0" 
                    allowFullScreen
                    title={block.data.caption || block.data.service}
                ></iframe>
            </div>
        );

    default:
      return <p>Unsupported block type: {block.type}</p>;
  }
};

export default function EditorJSRenderer({ data }) {
  if (!data || !Array.isArray(data.blocks)) {
    return null;
  }

  return (
    <div className="prose dark:prose-invert lg:prose-xl max-w-full">
      {data.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}
