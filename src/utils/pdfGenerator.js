import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

const clean = (str) => (str || "").replace(/\s+/g, " ").trim();

/* ---------------- LIST ---------------- */

const renderList = (ul) => {
  const items = [];

  ul.querySelectorAll("li").forEach((li) => {
    const text = clean(li.textContent);
    if (!text) return;

    items.push({
      text,
      fontSize: 11,
      margin: [0, 3]
    });
  });

  return {
    ul: items,
    margin: [10, 6]
  };
};

/* ---------------- PARSER ---------------- */

const parseHtmlToPdfContent = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const content = [];

  const walk = (node) => {
    if (!node || !node.tagName) return;

    const tag = node.tagName.toLowerCase();
    const text = clean(node.textContent);

    // H1 – Name
    if (tag === "h1") {
      content.push({
        text,
        alignment: "center",
        fontSize: 24,
        bold: true,
        margin: [0, 0, 0, 8]
      });
      return;
    }

    // H2 – Section Title
    if (tag === "h2") {
      content.push({
        text,
        fontSize: 15,
        bold: true,
        margin: [0, 14, 0, 4]
      });
      content.push({
        canvas: [{
          type: "line",
          x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1
        }],
        margin: [0, 2, 0, 8]
      });
      return;
    }

    // H3 – Job Title
    if (tag === "h3") {
      content.push({
        text,
        fontSize: 12,
        bold: true,
        margin: [0, 8, 0, 2]
      });
      return;
    }

    // Paragraph
    if (tag === "p") {
      content.push({
        text,
        fontSize: 11,
        margin: [0, 2, 0, 6]
      });
      return;
    }

    // UL
    if (tag === "ul") {
      content.push(renderList(node));
      return;
    }

    // Containers (div / section)
    if (tag === "div" || tag === "section" || tag === "header" || tag === "footer") {
      Array.from(node.children).forEach(walk);
    }
  };

  Array.from(doc.body.children).forEach(walk);
  return content;
};

/* ---------------- PUBLIC API ---------------- */

export const generatePdfBlobFromHtml = (html) => {
  return new Promise((resolve, reject) => {
    try {
      const match = html.match(/<RESUME_FINAL>([\s\S]*?)<\/RESUME_FINAL>/i);
      const resumeHtml = match ? match[1] : html;

      const content = parseHtmlToPdfContent(resumeHtml);

      if (!content.length) {
        throw new Error("PDF content is empty after parsing");
      }

      const docDefinition = {
        pageSize: "A4",
        pageMargins: [40, 40, 40, 40],
        content,
        defaultStyle: {
          fontSize: 11,
          lineHeight: 1.4
        }
      };
      console.log("PDF content:", content);
      pdfMake.createPdf(docDefinition).getBlob(resolve);
    } catch (err) {
      console.error("PDF Generation Failed:", err);
      reject(err);
    }
  });
};
