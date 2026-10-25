import { expect } from '@playwright/test';
import { BOOK_STORE_PAGE_DATA } from '../test-data/bookStorePageData';
const { credentials } = BOOK_STORE_PAGE_DATA;

export class BookStore {
    constructor(page) {
        this.page = page;
        this.bookStoreApplicationLink = page.getByRole('link', { name: 'Book Store Application' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.logoutButton = page.getByRole('button', { name: /log\s?out/i });
        this.username = page.getByRole('textbox', { name: 'UserName' });
        this.password =  page.getByRole('textbox', { name: 'Password' });
        this.bookStoretab = page.getByRole('link', { name: 'Book Store', exact: true });
        this.searchBook = page.getByRole('textbox', { name: 'Type to search' });


    }
    async clickBookStoreApplicationLink() {
        await this.bookStoreApplicationLink.scrollIntoViewIfNeeded();
        await this.bookStoreApplicationLink.click();
    }
    async clickLoginButton() {
        await this.loginButton.click();
    }
    async clickLogoutButton() {
        await this.logoutButton.scrollIntoViewIfNeeded();
        await this.logoutButton.click();
    }
    async clickBookStoreTab() {
        await this.bookStoretab.click();
    }
    async searchBookByName(book) {
        await this.searchBook.fill(book.title);
    }
    async validateBookSearch(book) {
        const bookRow = this.page.getByRole('row').filter({ hasText: book.title });
        await expect(bookRow, `Expected book "${book.title}" to appear in search results`).toBeVisible();

        const cells = bookRow.getByRole('cell');
        const bookDetails = {
            title: await cells.nth(1).innerText(),
            Author: await cells.nth(2).innerText(),
            Publisher: await cells.nth(3).innerText(),
        };

        expect(bookDetails.title, `Expected the book title to match "${book.title}"`).toBe(book.title);
        expect(bookDetails.Author, `Expected the author for "${book.title}" to match`).toBe(book.Author);
        expect(bookDetails.Publisher, `Expected the publisher for "${book.title}" to match`).toBe(book.Publisher);

        return bookDetails;
    }
    async enterCredentials() {
        await this.username.fill(credentials.username);
        await this.password.fill(credentials.password);
    }
    async validateLogin() {
        await expect(
            this.page.getByText(credentials.username),
            'Expected the logged-in username to be visible',
        ).toBeVisible();
        await expect(this.logoutButton, 'Expected the logout button to be visible after login').toBeVisible();
    }
}
