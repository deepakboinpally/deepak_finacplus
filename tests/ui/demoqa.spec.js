import { test } from '../../fixtures';
import { BOOK_STORE_PAGE_DATA } from '../test-data/bookStorePageData';
import { writeBookDetailsToFile } from '../actions/bookDetailsFileAction';

const { book1, book2, book3 } = BOOK_STORE_PAGE_DATA.bookName;

test('opens the Book Store Application', async ({ page, uibaseURL, bookStorePage }) => {
    await page.goto(uibaseURL);
    await bookStorePage.clickBookStoreApplicationLink();
    await bookStorePage.clickLoginButton();
    await bookStorePage.enterCredentials();
    await bookStorePage.clickLoginButton();
    await bookStorePage.validateLogin();
    await bookStorePage.clickBookStoreTab();

    await bookStorePage.searchBookByName(book1);
    const book1Details = await bookStorePage.validateBookSearch(book1);
    await bookStorePage.searchBookByName(book2);
    const book2Details = await bookStorePage.validateBookSearch(book2);
    await bookStorePage.searchBookByName(book3);
    const book3Details = await bookStorePage.validateBookSearch(book3);

    await writeBookDetailsToFile([book1Details, book2Details, book3Details]);
    await bookStorePage.clickLogoutButton();
});
