import { test } from '../../fixtures';
import { BOOK_STORE_PAGE_DATA } from '../test-data/bookStorePageData';
import { writeBookDetailsToFile } from '../actions/bookDetailsFileAction';

const { book1, book2, book3 } = BOOK_STORE_PAGE_DATA.bookName;

test('opens the Book Store Application', async ({ page, uibaseURL, bookStorePage }) => {
    // Open the application and navigate to the Book Store login page.
    await page.goto(uibaseURL);
    await bookStorePage.clickBookStoreApplicationLink();
    await bookStorePage.clickLoginButton();

    // Log in and open the Book Store tab.
    await bookStorePage.enterCredentials();
    await bookStorePage.clickLoginButton();
    await bookStorePage.validateLogin();
    await bookStorePage.clickBookStoreTab();

    // Search for each configured book and capture its details.
    await bookStorePage.searchBookByName(book1);
    const book1Details = await bookStorePage.validateBookSearch(book1);
    await bookStorePage.searchBookByName(book2);
    const book2Details = await bookStorePage.validateBookSearch(book2);
    await bookStorePage.searchBookByName(book3);
    const book3Details = await bookStorePage.validateBookSearch(book3);

    // Save the captured book details and log out.
    await writeBookDetailsToFile([book1Details, book2Details, book3Details]);
    await bookStorePage.clickLogoutButton();
});
