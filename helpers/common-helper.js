class CommonHelper {
  getEmailCommonPart() {
    let header = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\"\n" +
      "  \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n" +
      "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n" +
      "<head>\n" +
      "  <title>apply.insure</title>\n" +
      "  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"/>\n" +
      "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>\n" +
      "  <style type=\"text/css\">\n" +
      "    a {\n" +
      "      outline: none;\n" +
      "      color: #00b7fa;\n" +
      "      text-decoration: underline;\n" +
      "    }\n" +
      "\n" +
      "    a:hover {\n" +
      "      text-decoration: none !important;\n" +
      "    }\n" +
      "\n" +
      "    a[x-apple-data-detectors] {\n" +
      "      color: inherit !important;\n" +
      "      text-decoration: none !important;\n" +
      "    }\n" +
      "\n" +
      "    .active:hover {\n" +
      "      opacity: 0.8;\n" +
      "    }\n" +
      "\n" +
      "    .active {\n" +
      "      transition: all 0.3s ease;\n" +
      "    }\n" +
      "\n" +
      "    .active-d, .active-l {\n" +
      "      overflow: hidden;\n" +
      "    }\n" +
      "\n" +
      "    .active-d a, .active-l a {\n" +
      "      position: relative;\n" +
      "      display: inline-block;\n" +
      "    }\n" +
      "\n" +
      "    .active-d a:after, .active-l a:after {\n" +
      "      transition: all 0.3s ease;\n" +
      "      content: \"\";\n" +
      "      position: absolute;\n" +
      "      left: 0;\n" +
      "      top: 0;\n" +
      "      right: 0;\n" +
      "      bottom: 0;\n" +
      "    }\n" +
      "\n" +
      "    .active-d a:hover:after {\n" +
      "      background: rgba(0, 0, 0, 0.2);\n" +
      "    }\n" +
      "\n" +
      "    .active-l a:hover:after {\n" +
      "      background: rgba(255, 255, 255, 0.2);\n" +
      "    }\n" +
      "\n" +
      "    .h-u a {\n" +
      "      text-decoration: none !important;\n" +
      "    }\n" +
      "\n" +
      "    .h-u a:hover {\n" +
      "      text-decoration: underline !important;\n" +
      "    }\n" +
      "\n" +
      "    a img {\n" +
      "      border: none;\n" +
      "    }\n" +
      "\n" +
      "    table td {\n" +
      "      mso-line-height-rule: exactly;\n" +
      "    }\n" +
      "\n" +
      "    ul {\n" +
      "      Margin: 0 0 0 20px;\n" +
      "      padding: 0;\n" +
      "    }\n" +
      "\n" +
      "    .ExternalClass, .ExternalClass a, .ExternalClass span, .ExternalClass b, .ExternalClass br, .ExternalClass p, .ExternalClass div {\n" +
      "      line-height: inherit;\n" +
      "    }\n" +
      "\n" +
      "    .tpl-content {\n" +
      "      padding: 0 !important;\n" +
      "    }\n" +
      "\n" +
      "    .cke_show_borders {\n" +
      "      background: #e4e4e4 !important;\n" +
      "    }\n" +
      "\n" +
      "    .tpl-repeatmovewrap > .tpl-repeatmove {\n" +
      "      top: -15px !important;\n" +
      "    }\n" +
      "\n" +
      "    @media only screen and (max-width: 500px) {\n" +
      "      .flexible {\n" +
      "        width: 100% !important;\n" +
      "      }\n" +
      "\n" +
      "      .table-center {\n" +
      "        float: none !important;\n" +
      "        margin: 0 auto !important;\n" +
      "      }\n" +
      "\n" +
      "      .img-flex img {\n" +
      "        width: 100% !important;\n" +
      "        height: auto !important;\n" +
      "      }\n" +
      "\n" +
      "      .aligncenter {\n" +
      "        text-align: center !important;\n" +
      "      }\n" +
      "\n" +
      "      .table-holder {\n" +
      "        display: table !important;\n" +
      "        width: 100% !important;\n" +
      "      }\n" +
      "\n" +
      "      .thead {\n" +
      "        display: table-header-group !important;\n" +
      "        width: 100% !important;\n" +
      "      }\n" +
      "\n" +
      "      .trow {\n" +
      "        display: table-row !important;\n" +
      "        width: 100% !important;\n" +
      "      }\n" +
      "\n" +
      "      .tfoot {\n" +
      "        display: table-footer-group !important;\n" +
      "        width: 100% !important;\n" +
      "      }\n" +
      "\n" +
      "      .flex {\n" +
      "        display: block !important;\n" +
      "        width: 100% !important;\n" +
      "      }\n" +
      "\n" +
      "      .hide {\n" +
      "        display: none !important;\n" +
      "        width: 0 !important;\n" +
      "        height: 0 !important;\n" +
      "        padding: 0 !important;\n" +
      "        font-size: 0 !important;\n" +
      "        line-height: 0 !important;\n" +
      "      }\n" +
      "\n" +
      "      .plr-0 {\n" +
      "        padding-left: 0 !important;\n" +
      "        padding-right: 0 !important;\n" +
      "      }\n" +
      "\n" +
      "      .plr-15 {\n" +
      "        padding-left: 15px !important;\n" +
      "        padding-right: 15px !important;\n" +
      "      }\n" +
      "\n" +
      "      .pt-0 {\n" +
      "        padding-top: 0 !important;\n" +
      "      }\n" +
      "\n" +
      "      .pt-10 {\n" +
      "        padding-top: 10px !important;\n" +
      "      }\n" +
      "\n" +
      "      .pt-30 {\n" +
      "        padding-top: 30px !important;\n" +
      "      }\n" +
      "\n" +
      "      .pb-15 {\n" +
      "        padding-bottom: 15px !important;\n" +
      "      }\n" +
      "\n" +
      "      .pb-30 {\n" +
      "        padding-bottom: 30px !important;\n" +
      "      }\n" +
      "    }\n" +
      "  </style>\n" +
      "</head>\n" +
      "<body bgcolor=\"#ffffff\" style=\"margin:0; padding:0; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;\">\n" +
      "<table bgcolor=\"#ffffff\" width=\"100%\" style=\"min-width:320px;\" cellspacing=\"0\" cellpadding=\"0\">\n" +
      "  <!-- fix for gmail -->\n" +
      "  <tr>\n" +
      "    <td class=\"hide\" style=\"line-height:0;\">\n" +
      "      <div style=\"white-space:nowrap; font:15px/0 courier;\"></div>\n" +
      "    </td>\n" +
      "  </tr>\n" +
      "  <tr>\n" +
      "    <td class=\"pt-10 plr-0\" style=\"padding:24px 20px 0;\">\n" +
      "      <table class=\"flexible\" width=\"600\" align=\"center\" style=\"margin:0 auto;\" cellpadding=\"0\" cellspacing=\"0\">\n" +
      "        <!-- content -->\n" +
      "        <tr>\n" +
      "          <td>\n" +
      "            <!-- block-04 -->\n" +
      "            <table mc:repeatable=\"container\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\n" +
      "              <tr>\n" +
      "                <td mc:edit=\"block_23\" class=\"img-flex\">\n" +
      "                </td>\n" +
      "              </tr>\n" +
      "              <tr>\n" +
      "                <td mc:edit=\"block_24\" class=\"plr-15 pb-20\" bgcolor=\"#fbfbfb\" align=\"center\"\n" +
      "                    style=\"padding:18px 69px; font:24px/28px Verdana, Geneva, sans-serif; color:#000;\">\n" +
      "                  <img src=\"https://apply.insure/assets/images/logo.png\"\n" +
      "                       style=\"vertical-align:middle; width: 30px !important; height: 30px !important;\" alt=\"Ultimaker\"/> Apply.insure\n" +
      "                </td>\n" +
      "              </tr>\n" +
      "              <tr>\n" +
      "                <td class=\"plr-15 pb-15\" style=\"padding:33px 95px 60px;\">\n" +
      "                  <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">";
    let footer = "\n" +
      "                  </table>\n" +
      "                </td>\n" +
      "              </tr>\n" +
      "            </table>\n" +
      "          </td>\n" +
      "        </tr>\n" +
      "        <!-- footer -->\n" +
      "        <tr>\n" +
      "          <td class=\"plr-15\" style=\"padding:0 34px 30px;\">\n" +
      "            <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\n" +
      "              <tr>\n" +
      "                <th class=\"flex\" width=\"182\" align=\"left\" style=\"vertical-align:top; padding:0;\">\n" +
      "                  <table class=\"table-center\" cellpadding=\"0\" cellspacing=\"0\">\n" +
      "                    <tr>\n" +
      "                      <td mc:edit=\"block_34\" class=\"active\"\n" +
      "                          style=\"line-height:13px; font-size:10px; mso-line-height-rule:at-least;\">\n" +
      "                        <a style=\"text-decoration:none;\" target=\"_blank\" href=\"http://link\">\n" +
      "                          <img src=\"https://www.psd2html.com/examples/markup/ultimaker/ico-facebook.png\" width=\"6\"\n" +
      "                               style=\"vertical-align:top;\" alt=\"fb\"/>\n" +
      "                        </a>\n" +
      "                      </td>\n" +
      "                      <td width=\"28\"></td>\n" +
      "                      <td mc:edit=\"block_35\" class=\"active\"\n" +
      "                          style=\"line-height:13px; font-size:10px; mso-line-height-rule:at-least;\">\n" +
      "                        <a style=\"text-decoration:none;\" target=\"_blank\" href=\"http://link\">\n" +
      "                          <img src=\"https://www.psd2html.com/examples/markup/ultimaker/ico-twitter.png\" width=\"14\"\n" +
      "                               style=\"vertical-align:top;\" alt=\"tw\"/>\n" +
      "                        </a>\n" +
      "                      </td>\n" +
      "                      <td width=\"21\"></td>\n" +
      "                      <td mc:edit=\"block_36\" class=\"active\"\n" +
      "                          style=\"line-height:13px; font-size:10px; mso-line-height-rule:at-least;\">\n" +
      "                        <a style=\"text-decoration:none;\" target=\"_blank\" href=\"http://link\">\n" +
      "                          <img src=\"https://www.psd2html.com/examples/markup/ultimaker/ico-instagram.png\" width=\"12\"\n" +
      "                               style=\"vertical-align:top;\" alt=\"ig\"/>\n" +
      "                        </a>\n" +
      "                      </td>\n" +
      "                      <td width=\"21\"></td>\n" +
      "                      <td mc:edit=\"block_37\" class=\"active\"\n" +
      "                          style=\"line-height:13px; font-size:10px; mso-line-height-rule:at-least;\">\n" +
      "                        <a style=\"text-decoration:none;\" target=\"_blank\" href=\"http://link\">\n" +
      "                          <img src=\"https://www.psd2html.com/examples/markup/ultimaker/ico-youtube.png\" width=\"16\"\n" +
      "                               style=\"vertical-align:top;\" alt=\"yt\"/>\n" +
      "                        </a>\n" +
      "                      </td>\n" +
      "                    </tr>\n" +
      "                  </table>\n" +
      "                </th>\n" +
      "                <th class=\"flex\" width=\"20\" height=\"20\" style=\"padding:0;\"></th>\n" +
      "                <th class=\"flex\" align=\"left\" style=\"vertical-align:top; padding:0;\">\n" +
      "                  <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\n" +
      "                    <tr>\n" +
      "                      <td mc:edit=\"block_38\" class=\"aligncenter\"\n" +
      "                          style=\"font:11px/14px Verdana, Geneva, sans-serif; color:#343a3f;\">\n" +
      "                        &copy; 2019 apply.insure\n" +
      "                      </td>\n" +
      "                    </tr>\n" +
      "                  </table>\n" +
      "                </th>\n" +
      "                <th class=\"flex\" width=\"20\" height=\"20\" style=\"padding:0;\"></th>\n" +
      "                <th class=\"flex\" width=\"110\" align=\"left\" style=\"vertical-align:top; padding:0;\">\n" +
      "                  <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\n" +
      "                    <tr>\n" +
      "                      <td mc:edit=\"block_39\" class=\"aligncenter\" align=\"right\"\n" +
      "                          style=\"font:11px/14px Verdana, Geneva, sans-serif; color:#2e353b;\">\n" +
      "                        <a style=\"color:#2e353b; text-decoration:underline;\" href=\"*|UNSUB|*\">Unsubscribe</a>\n" +
      "                      </td>\n" +
      "                    </tr>\n" +
      "                  </table>\n" +
      "                </th>\n" +
      "              </tr>\n" +
      "            </table>\n" +
      "          </td>\n" +
      "        </tr>\n" +
      "      </table>\n" +
      "    </td>\n" +
      "  </tr>\n" +
      "</table>\n" +
      "</body>\n" +
      "</html>\n";
    return {header: header, footer: footer};
  };
}

module.exports = CommonHelper;
