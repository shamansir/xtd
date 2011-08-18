/// header_code_here

var pmd_LINK            = 0,    /**< Explicit link */
    pmd_AUTO_LINK_URL   = 1,    /**< Implicit URL link */
    pmd_AUTO_LINK_EMAIL = 2,    /**< Implicit email link */
    pmd_IMAGE           = 3,    /**< Image definition */
    pmd_CODE            = 4,    /**< Code (inline) */
    pmd_HTML            = 5,    /**< HTML */
    pmd_HTML_ENTITY     = 6,    /**< HTML special entity definition */
    pmd_EMPH            = 7,    /**< Emphasized text */
    pmd_STRONG          = 8,    /**< Strong text */
    pmd_LIST_BULLET     = 9,    /**< Bullet for an unordered list item */
    pmd_LIST_ENUMERATOR = 10,   /**< Enumerator for an ordered list item */
    pmd_COMMENT         = 11,   /**< (HTML) Comment */

    // Code assumes that pmd_H1-6 are in order.
    pmd_H1              = 12,   /**< Header, level 1 */
    pmd_H2              = 13,   /**< Header, level 2 */
    pmd_H3              = 14,   /**< Header, level 3 */
    pmd_H4              = 15,   /**< Header, level 4 */
    pmd_H5              = 16,   /**< Header, level 5 */
    pmd_H6              = 17,   /**< Header, level 6 */

    pmd_BLOCKQUOTE      = 18,   /**< Blockquote */
    pmd_VERBATIM        = 19,   /**< Verbatim (e.g. block of code) */
    pmd_HTMLBLOCK       = 20,   /**< Block of HTML */
    pmd_HRULE           = 21,   /**< Horizontal rule */
    pmd_REFERENCE       = 22,   /**< Reference */
    pmd_NOTE            = 23,   /**< Note */

    // Utility types used by the parser itself:

    // List of pmd_RAW element lists, each to be processed separately from
    // others (for each element in linked lists of this type, `children` points
    // to a linked list of pmd_RAW elements):
    pmd_RAW_LIST        = 24,   /**< Internal to parser. Please ignore. */

    // Span marker for positions in original input to be post-processed
    // in a second parsing step:
    pmd_RAW             = 25,   /**< Internal to parser. Please ignore. */

    // Additional text to be parsed along with spans in the original input
    // (these may be added to linked lists of pmd_RAW elements):
    pmd_EXTRA_TEXT      = 26,   /**< Internal to parser. Please ignore. */

    // Separates linked lists of pmd_RAW elements into parts to be processed
    // separate from each other:
    pmd_SEPARATOR       = 27,   /**< Internal to parser. Please ignore. */

    // Placeholder element used while parsing:
    pmd_NO_TYPE         = 28,   /**< Internal to parser. Please ignore. */

    // Linked list of *all* elements created while parsing:
    pmd_ALL             = 29    /**< Internal to parser. Please ignore. */;

function pmd_type_name(type) {
    switch (type)
    {
        case pmd_SEPARATOR:          return "SEPARATOR"; break;
        case pmd_EXTRA_TEXT:         return "EXTRA_TEXT"; break;
        case pmd_NO_TYPE:            return "NO TYPE"; break;
        case pmd_RAW_LIST:           return "RAW_LIST"; break;
        case pmd_RAW:                return "RAW"; break;

        case pmd_LINK:               return "LINK"; break;
        case pmd_IMAGE:              return "IMAGE"; break;
        case pmd_CODE:               return "CODE"; break;
        case pmd_HTML:               return "HTML"; break;
        case pmd_EMPH:               return "EMPH"; break;
        case pmd_STRONG:             return "STRONG"; break;
        case pmd_LIST_BULLET:        return "LIST_BULLET"; break;
        case pmd_LIST_ENUMERATOR:    return "LIST_ENUMERATOR"; break;
        case pmd_H1:                 return "H1"; break;
        case pmd_H2:                 return "H2"; break;
        case pmd_H3:                 return "H3"; break;
        case pmd_H4:                 return "H4"; break;
        case pmd_H5:                 return "H5"; break;
        case pmd_H6:                 return "H6"; break;
        case pmd_BLOCKQUOTE:         return "BLOCKQUOTE"; break;
        case pmd_VERBATIM:           return "VERBATIM"; break;
        case pmd_HTMLBLOCK:          return "HTMLBLOCK"; break;
        case pmd_HRULE:              return "HRULE"; break;
        case pmd_REFERENCE:          return "REFERENCE"; break;
        case pmd_NOTE:               return "NOTE"; break;
        default:                 return "?";
    }
}

/**
* \brief Number of types in pmd_element_type.
* \sa pmd_element_type
*/
var pmd_NUM_TYPES = 30;

/**
* \brief Number of *language element* types in pmd_element_type.
* \sa pmd_element_type
*/
var pmd_NUM_LANG_TYPES = (pmd_NUM_TYPES - 6);

var pmd_EXT_NOTES = 1;
var pmd_EXT_DEFLISTS = 2;

var pmd_EXTENTIONS = 0;

var refs = Object.create(null); // label: { text:
                                //          title:
                                //          address: }

var elems = new Array(pmd_NUM_TYPES);

var TYPESTR = pmd_type_name; // alias

function mk_element(type, pos, content) {
    if (!elems[type]) elems[type] = [];
    elems[type].push({ 'type': type, 'pos': pos, content: 'content' });
    console.log(elems[type][elems.length - 1]);
    return elems[type][elems.length - 1];
};

function mk_etext(data, type) {
    console.log('mk_etext: ', TYPESTR(type));
};

function add(type) {
    console.log('add: ', TYPESTR(type));
};

function extension(type) {
    console.log('extension: ', TYPESTR(type));
    return true;
};

function reference_exists(data, type) {
    console.log('reference_exists: ', data, type);
};

function get_reference(data, type) {
    console.log('get_reference: ', data, type);
}

// aliases
var elem = mk_element;
function elem_s(x, s, content) { return mk_element(x, s.pos, s.content); }
function mk_sep()    { return mk_element(pmd_SEPARATOR, 0,0) }
function mk_notype() { return mk_element(pmd_NO_TYPE, 0,0) }
function etext(x)    { return mk_etext(x) }
function ADD(x)      { return add(x) }
function EXT(x)      { return pmd_EXTENTIONS & x }
function REF_EXISTS(x)   { return refs[x] !== undefined; }
function GET_REF(x)      { return refs[x]; }
//var PARSING_REFERENCES = G.data.parsing_only_references;
//function FREE_LABEL(l)   { l.label = null; }
//function FREE_ADDRESS(l) { l.address = null; }

var $$ = null;

