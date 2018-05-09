import * as trace from 'tns-core-modules/trace';

import * as TKUnit from "../../TKUnit";
import * as testModule from "../../ui-test";

// >> webview-require
import * as webViewModule from "@nota/nativescript-webview-ext";
// << webview-require

trace.setCategories('NOTA');
trace.enable();

// >> declare-webview-xml
//  <Page>
//       {%raw%}<WebView src="{{ someUrl | pathToLocalFile | htmlString }}" />{%endraw%}
//  </Page>
// << declare-webview-xml

export class WebViewTest extends testModule.UITest<webViewModule.WebViewExt> {

    public create(): webViewModule.WebViewExt {
        // >> declare-webview
        let webView = new webViewModule.WebViewExt();
        // << declare-webview
        return webView;
    }

    public testLoadExistingUrl(done) {
        let webView = this.testView;

        // >> webview-url
        webView.on(webViewModule.WebViewExt.loadFinishedEvent, function (args: webViewModule.LoadEventData) {
            let message;
            if (!args.error) {
                message = "WebView finished loading " + args.url;
            }
            else {
                message = "Error loading " + args.url + ": " + args.error;
            }

            // >> (hide)
            try {
                TKUnit.assertNull(args.error, args.error);
                TKUnit.assertEqual(args.url, "https://github.com/", "args.url");
                done(null);
            }
            catch (e) {
                done(e);
            }

            // << (hide)
        });
        webView.src = "https://github.com/";
        // << webview-url
    }

    public testLoadLocalFile(done) {
        let webView = this.testView;

        // >> webview-localfile
        webView.on(webViewModule.WebViewExt.loadFinishedEvent, function (args: webViewModule.LoadEventData) {
            // >> (hide)
            let actual;
            let expectedTitle = 'MyTitle';

            if (webView.ios) {
                actual = webView.ios.title;
            } else if (webView.android) {
                actual = webView.android.getTitle();
            }

            try {
                TKUnit.assertNull(args.error, args.error);
                TKUnit.assertEqual(actual, expectedTitle, "File ~/ui/web-view/test.html not loaded properly.");
                done(null);
            }
            catch (e) {
                done(e);
            }
            // << (hide)

            let message;
            if (!args.error) {
                message = "WebView finished loading " + args.url;
            }
            else {
                message = "Error loading " + args.url + ": " + args.error;
            }
        });
        webView.src = "~/ui/web-view/test.html";
        // << webview-localfile
    }

    public testLoadLocalFileWithSpaceInPath(done) {
        let webView = this.testView;

        webView.on(webViewModule.WebViewExt.loadFinishedEvent, function (args: webViewModule.LoadEventData) {
            let actual;
            let expectedTitle = 'MyTitle';

            if (webView.ios) {
                actual = webView.ios.title;
            } else if (webView.android) {
                actual = webView.android.getTitle();
            }

            try {
                TKUnit.assertNull(args.error, args.error);
                TKUnit.assertEqual(actual, expectedTitle, "File ~/ui/web-view/test.html not loaded properly.");
                done(null);
            }
            catch (e) {
                done(e);
            }

            let message;
            if (!args.error) {
                message = "WebView finished loading " + args.url;
            }
            else {
                message = "Error loading " + args.url + ": " + args.error;
            }
        });
        webView.src = "~/ui/web-view/test with spaces.html";
    }

    public testLoadHTMLString(done) {
        let webView = this.testView;

        // >> webview-string
        webView.on(webViewModule.WebViewExt.loadFinishedEvent, function (args: webViewModule.LoadEventData) {
            // >> (hide)

            let actual;
            const expected = 'MyTitle';

            if (webView.ios) {
                actual = webView.ios.title;
            } else if (webView.android) {
                actual = webView.android.getTitle();
            }

            try {
                TKUnit.assertNull(args.error, args.error);
                TKUnit.assertEqual(actual, expected, "HTML string not loaded properly. Actual: ");
                done(null);
            }
            catch (e) {
                done(e);
            }
            // << (hide)

            let message;
            if (!args.error) {
                message = "WebView finished loading " + args.url;
            }
            else {
                message = "Error loading " + args.url + ": " + args.error;
            }
        });
        webView.src = '<!DOCTYPE html><html><head><title>MyTitle</title><meta charset="utf-8" /></head><body><span style="color:red">TestÖ</span></body></html>';
        // << webview-string
    }

    public testLoadSingleXLocalFile(done) {
        let webView = this.testView;

        const emptyHTMLFile = '~/ui/web-view/assets/html/empty.html';
        const src = 'x-local://empty.html';
        webView.registerLocalResource('empty.html', emptyHTMLFile);

        // >> webview-x-localfile
        webView.on(webViewModule.WebViewExt.loadFinishedEvent, async function (args: webViewModule.LoadEventData) {
            // >> (hide)
            let actual;
            let expectedTitle = 'Blank';

            actual = await webView.executeJavaScript('document.title');

            try {
                TKUnit.assertNull(args.error, args.error);
                TKUnit.assertEqual(actual, expectedTitle, `File ${src} not loaded properly.`);
                done(null);
            }
            catch (e) {
                done(e);
            }
            // << (hide)

            let message;
            if (!args.error) {
                message = "WebView finished loading " + args.url;
            }
            else {
                message = "Error loading " + args.url + ": " + args.error;
            }
        });
        webView.src = src;
        // << webview-x-localfile
    }

    public testLoadUpperCaseSrc(done) {
        let webView = this.testView;
        let targetSrc = "HTTPS://github.com/";

        webView.on(webViewModule.WebViewExt.loadFinishedEvent, function (args: webViewModule.LoadEventData) {
            try {
                TKUnit.assertNull(args.error, args.error);
                TKUnit.assertEqual(args.url, targetSrc.toLowerCase(), "args.url");
                done(null);
            }
            catch (e) {
                done(e);
            }
        });

        webView.src = targetSrc;
    }
}

export function createTestCase(): WebViewTest {
    return new WebViewTest();
}
