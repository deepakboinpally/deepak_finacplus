import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function writeBookDetailsToFile(bookDetails) {
    const outputDirectory = join(process.cwd(), 'test-results');
    await mkdir(outputDirectory, { recursive: true });
    const books = Array.isArray(bookDetails) ? bookDetails : [bookDetails];
    const contents = books
        .map(({ title, Author, Publisher }) =>
            `Title: ${title}\nAuthor: ${Author}\nPublisher: ${Publisher}`,
        )
        .join('\n\n');

    await writeFile(
        join(outputDirectory, 'book-details.txt'),
        `${contents}\n`,
        'utf8',
    );
}
