// All the code below is manually translated from C++ to JS by shaman.sir,
// C++ code author is Ali Rantakari (http://hasseg.org/peg-markdown-highlight/)
// the C++ file used as source is located here: http://hasseg.org/gitweb?p=peg-markdown-highlight.git;a=blob;f=pmh_parser_head.c;h=51528032723b9fc0eed0e854abbe2847b9d127b4;hb=HEAD

var util = require('util');

// ELEMENTS TYPES ==============================================================

var t = new Object(null);

t.pmd_PARA            = 0;    /**< Paragraph */
t.pmd_LINK            = 1;    /**< Explicit link */
t.pmd_AUTO_LINK_URL   = 2;    /**< Implicit URL link */
t.pmd_AUTO_LINK_EMAIL = 3;    /**< Implicit email link */
t.pmd_IMAGE           = 4;    /**< Image definition */
t.pmd_CODE            = 5;    /**< Code (inline) */
t.pmd_HTML            = 6;    /**< HTML */
t.pmd_HTML_ENTITY     = 7;    /**< HTML special entity definition */
t.pmd_EMPH            = 8;    /**< Emphasized text */
t.pmd_STRONG          = 9;    /**< Strong text */
t.pmd_LIST_BULLET     = 10;   /**< Bullet for an unordered list item */
t.pmd_LIST_ENUMERATOR = 11;   /**< Enumerator for an ordered list item */
t.pmd_COMMENT         = 12;   /**< (HTML) Comment */

// Code assumes that pmd_H1-6 are in order.
t.pmd_H1              = 13;   /**< Header, level 1 */
t.pmd_H2              = 14;   /**< Header, level 2 */
t.pmd_H3              = 15;   /**< Header, level 3 */
t.pmd_H4              = 16;   /**< Header, level 4 */
t.pmd_H5              = 17;   /**< Header, level 5 */
t.pmd_H6              = 18;   /**< Header, level 6 */

t.pmd_BLOCKQUOTE      = 19;   /**< Blockquote */
t.pmd_VERBATIM        = 20;   /**< Verbatim (e.g. block of code) */
t.pmd_HTMLBLOCK       = 21;   /**< Block of HTML */
t.pmd_HRULE           = 22;   /**< Horizontal rule */
t.pmd_REFERENCE       = 23;   /**< Reference */
t.pmd_NOTE            = 24;   /**< Note */

// Utility types used by the parser itself:

// List of pmd_RAW element lists, each to be processed separately from
// others (for each element in linked lists of this type, `children` points
// to a linked list of pmd_RAW elements):
t.pmd_RAW_LIST        = 25,   /**< Internal to parser. Please ignore. */

// Span marker for positions in original input to be post-processed
// in a second parsing step:
t.pmd_RAW             = 26,   /**< Internal to parser. Please ignore. */

// Additional text to be parsed along with spans in the original input
// (these may be added to linked lists of pmd_RAW elements):
t.pmd_EXTRA_TEXT      = 27,   /**< Internal to parser. Please ignore. */

// Separates linked lists of pmd_RAW elements into parts to be processed
// separate from each other:
t.pmd_SEPARATOR       = 28,   /**< Internal to parser. Please ignore. */

// Placeholder element used while parsing:
t.pmd_NO_TYPE         = 29,   /**< Internal to parser. Please ignore. */

// Linked list of *all* elements created while parsing:
t.pmd_ALL             = 30    /**< Internal to parser. Please ignore. */;

t.type_name = function(type) {
    switch (type) {
        case t.pmd_SEPARATOR:          return "SEPARATOR";
        case t.pmd_EXTRA_TEXT:         return "EXTRA_TEXT";
        case t.pmd_NO_TYPE:            return "NO_TYPE";
        case t.pmd_RAW_LIST:           return "RAW_LIST";
        case t.pmd_RAW:                return "RAW";

        case t.pmd_PARA:               return "PARA";
        case t.pmd_LINK:               return "LINK";
        case t.pmd_IMAGE:              return "IMAGE";
        case t.pmd_CODE:               return "CODE";
        case t.pmd_HTML:               return "HTML";
        case t.pmd_EMPH:               return "EMPH";
        case t.pmd_STRONG:             return "STRONG";
        case t.pmd_COMMENT:            return "COMMENT";
        case t.pmd_HTML_ENTITY:        return "HTML_ENTITY";
        case t.pmd_LIST_BULLET:        return "LIST_BULLET";
        case t.pmd_LIST_ENUMERATOR:    return "LIST_ENUMERATOR";
        case t.pmd_H1:                 return "H1";
        case t.pmd_H2:                 return "H2";
        case t.pmd_H3:                 return "H3";
        case t.pmd_H4:                 return "H4";
        case t.pmd_H5:                 return "H5";
        case t.pmd_H6:                 return "H6";
        case t.pmd_BLOCKQUOTE:         return "BLOCKQUOTE";
        case t.pmd_VERBATIM:           return "VERBATIM";
        case t.pmd_HTMLBLOCK:          return "HTMLBLOCK";
        case t.pmd_HRULE:              return "HRULE";
        case t.pmd_REFERENCE:          return "REFERENCE";
        case t.pmd_NOTE:               return "NOTE";

        case t.pmd_AUTO_LINK_URL:      return "AUTO_LINK_URL";
        case t.pmd_AUTO_LINK_EMAIL:    return "AUTO_LINK_EMAIL";

        default:                       return "?";
    }
}

/**
* \brief Number of types in pmd_element_type.
* \sa pmd_element_type
*/
t.pmd_NUM_TYPES = 31;

/**
* \brief Number of *language element* types in pmd_element_type.
* \sa pmd_element_type
*/
t.pmd_NUM_LANG_TYPES = (t.pmd_NUM_TYPES - 6);

// EXTENSIONS ==================================================================

var e = new Object(null);

// PHP Markdown Extra extensions
e.pmd_EXT_FOOTNOTES = 1;
e.pmd_EXT_DEF_LISTS = 2; // + "\:"
e.pmd_EXT_SMART_BLOCKLVL_HTML = 4;
e.pmd_EXT_ABBREVIATIONS = 8;
e.pmd_EXT_MARKDOWN_INSIDE_HTML = 16;
e.pmd_EXT_HEADERS_LINKS = 32;
e.pmd_EXT_CURLY_CODE = 64;
e.pmd_EXT_ALT_TABLES = 128; // + "\|"
e.pmd_EXT_NO_EMPHASIS_IN_QUOTES = 256;

// Other Extentions
e.pmd_EXT_HASHBANG_CODE_LANG = 512;
e.pmd_EXT_DOC_META_INFO = 1024;
e.pmd_EXT_NESTED_BLOCKQUOTES = 2048;
e.pmd_EXT_BLOCKQUOTES_SOURCES = 4096;

e.pmd_EXTENSIONS = e.pmd_EXT_FOOTNOTES
                /* | e.pmd_EXT_DEF_LISTS
                   | e.pmd_EXT_HASHBANG_CODE_LANG
                   | e.pmd_EXT_HEADERS_LINKS */;

e.ext_name = function(ext) {
    switch (ext) {
        case e.pmd_EXT_FOOTNOTES:             return "EXT_FOOTNOTES";
        case e.pmd_EXT_DEF_LISTS:             return "EXT_DEF_LISTS";
        case e.pmd_EXT_SMART_BLOCKLVL_HTML:   return "EXT_SMART_BLOCKLVL_HTML";
        case e.pmd_EXT_ABBREVIATIONS:         return "EXT_ABBREVIATIONS";
        case e.pmd_EXT_MARKDOWN_INSIDE_HTML:  return "EXT_MARKDOWN_INSIDE_HTML";
        case e.pmd_EXT_HEADERS_LINKS:         return "EXT_HEADERS_LINKS";
        case e.pmd_EXT_CURLY_CODE:            return "EXT_CURLY_CODE";
        case e.pmd_EXT_ALT_TABLES:            return "EXT_ALT_TABLES";
        case e.pmd_EXT_NO_EMPHASIS_IN_QUOTES: return "EXT_NO_EMPH_IN_QUOTES";
        case e.pmd_EXT_HASHBANG_CODE_LANG:    return "EXT_HASHBANG_CODE_LANG";
        case e.pmd_EXT_DOC_META_INFO:         return "EXT_DOC_META_INFO";
        case e.pmd_EXT_NESTED_BLOCKQUOTES:    return "EXT_NESTED_BLOCKQUOTES";
        case e.pmd_EXT_BLOCKQUOTES_SOURCES:   return "EXT_BLOCKQUOTES_SOURCES";
        default:                              return "?";
    }
}

// UTILS =======================================================================

/* pad some string to specified number of chars */

var EOL_NO_STRIP = 0;
var EOL_STRIP = 1;

function _pad(str, num, strip_eol) {
    var result;
    if (!str) {
        result = '';
        while (num > 0) { result += ' '; num--; }
    } else {
        if (strip_eol) { str = str.replace(/\n\r?/g, ' '); }
        if (num > str.length) {
            result = str;
            while (num > str.length) { result += ' '; num--; }
        } else if (num === str.length) {
            result = str;
        } else /*if (num < str.length)*/ {
            if (num > 12) {
               result = str.substring(0, (num / 2) - 3);
               result += ' ... ';
               result += str.substring(str.length - ((num / 2) - 3), str.length);
               while (num > result.length) { result += ' '; }
            } else {
               result = str.substring(0, num - 2);
               result += '} ';
            }
        }
    }
    return result;
}

/* return element information string */
function elem_info(elm, col_width) {
    return _pad(elm.pos + ':' + elm.end, 11) + _pad(t.type_name(elm.type), 12) +
           ((elm.text != null) ? _pad('<< ' + elm.text + ' >>', col_width || 54) : '--no-text--');
}

var VIEW_QUICK = 0;
var SHOW_DATA = 1;
var SHOW_CHLD = 2;

/* return state information string */
function state_info(state, view) {

    view = view || VIEW_QUICK;

    var result = '\n\n';
    result += '// chain ' + '\n\n';

    map_elems(state.root, function(elem) {
       result += elem_info(elem) + '\n';
       if (((view & SHOW_DATA) > 0) && elem.data) {
           result += '      DATA :: '
                     + _pad(util.inspect(elem.data,false,3), 66, EOL_STRIP) + '\n';
       }
       if (((view & SHOW_CHLD) > 0) && elem.children) {
           result += '      CHLD :: ' + '\n';
           map_elems(elem.children, function(elem) {
                result += '            ' + elem_info(elem, 42) + '\n';
                if (elem.children) {
                    result += _pad('', 11) + ' CHLD :: ' + '\n';
                    map_elems(elem.children, function(elem) {
                        result += _pad('', 20) + elem_info(elem, 34) + '\n';
                        if (elem.children) result += _pad('', 20) + 'has-children'
                    });
                };
           });
       }
       if (view !== VIEW_QUICK) result += '\n';
    });

    result += '// refs ' + '\n\n';

    for (ref_label in state.refs) {
       result += _pad(ref_label, 20) + ' -> ' + state.refs[ref_label] + '\n';
    };

    result += '\n\n' + '// elems ' + '\n';

    for (var i = 0; i < t.pmd_NUM_TYPES; i++) {
        var elems = state.elems[i];
        if (elems != null) {
            result += '\n# ' + t.type_name(i) + ':\n\n' ;
            for (var j = 0; j < elems.length; j++) {
                result += elem_info(elems[j]) + '\n';
            };
        }
    }

    result += '\n\n' + '// links ' + '\n\n';

    var elems = state.elems[t.pmd_LINK];
    if (elems != null) {
        for (var j = 0; j < elems.length; j++) {
            result += _pad(elems[j].data.title, 16) + _pad(elems[j].data.label, 12) + _pad(elems[j].data.source, 27) + _pad(elems[j].text, 23) + '\n';
        };
    }

    return result;
}

// STATE =======================================================================

var g_state = {
    'cur': null, // current element
    'root': null, // elements dbl-linked list head
    'extensions': e.pmd_EXTENSIONS, // enabled extensions
    'elems': [], // elements, indexed by type (int)
    'refs': {}, // references map (label: element)
    '_rwaiters': {} // waiters for references, map (label: array of func)
};

g_state.elems = new Array(t.pmd_NUM_TYPES);

g_state.info = function(view) { return state_info(this, view); }

g_state.toString = function() { return state_info(this); }

// TODO: a function that will add node type markers to the text using state refs
/* g_state.spec(text) {
    var result = '';


} */

// TODO: think about indentation, allow 3-spaces indent for lists?

// FUNCTIONS ===================================================================

/* map a function to a chain of elements */
function map_elems(first, func) {
    if (first != null) {
        var cursor = first;
        while (cursor != null) {
            if (func) func(cursor);
            cursor = cursor.next;
        }
    }
}

function _elem_info() { return elem_info(this); }

/* create element node with specified parameters */
function make_element_i(state, type, pos, end, text) {
    //console.log('make_element: ', t.type_name(type), pos, end, text);
    return { 'type'       : type,
             'pos'        : pos,
             'end'        : end,
             'next'       : null,
             'prev'       : null,
             'text'       : text || null,
             'children'   : null, // elements inside this one
             'data'       : null,
             'toString'   : _elem_info };
}

function make_element(state, type, chunk) {
    return make_element_i(state, type, chunk.pos, chunk.end, chunk.match);
}

/* add element and some data (optional) to the state */
function add_element(state, elem, data) {
    //console.log('add: ', elem);

    if (state.root == null) {
        state.root = elem || null;
    }

    if (state.cur != null) {
        state.cur.next = elem;
        elem.prev = null;
    }

    state.cur = elem;

    if (state.elems[elem.type] == null) {
        state.elems[elem.type] = [];
    }
    state.elems[elem.type].push(elem);

    elem.data = data;

};

/* check if extension is enabled */
function extension(state, extension) {
    //console.log('extension: ', e.ext_name(extension), state.extensions & extension);
    return state.extensions & extension;
};

/* save reference data for a label */
function save_reference(state, label, elm) {
    if (!label) return;
    var label = label.toLowerCase();
    state.refs[label] = elm;
    var waiters = state._rwaiters[label];
    if (waiters) {
       for (var i = 0; i < waiters.length; waiters++) {
            waiters[i](elm);
       }
       delete state._rwaiters[label];
    }
}

/* get reference data using label */
function get_reference(state, label) {
    //console.log('get_reference: ', label);
    if (!label) return;
    return state.refs[label];
}

/* wait for reference data to appear and then call passed function
   (will be called with null if there is no such reference at all) */
function wait_reference(state, label, func) {
    var label = label.toLowerCase();
    var ref = get_reference(state,label);
    if (ref) { func(ref) }
    else {
        if (!state._rwaiters[label]) state._rwaiters[label] = [];
        state._rwaiters[label].push(func);
    }
}

/* release (call with null) all waiting functions that hasn't got their references */
function release_waiters(state) {
    for (label in state._rwaiters) {
        var waiters = state._rwaiters[label];
        if (waiters) {
           for (var i = 0; i < waiters.length; waiters++) {
                waiters[i](null);
           }
           delete state._rwaiters[label];
        }
    }
}

// GLOBAL ======================================================================

/* executed before parsing */
function before(state) {
    // things to do before parsing
}

/* executed after parsing */
function after(state) {
    // things to do after parsing
    release_waiters(state);

    // sort_by_pos(state)
    // pack_children(state)
    // parse_lists(state)
}

// ALIAS =======================================================================

function elem(x,c)         { return make_element(g_state,x,c) } // type and chunk
function elem_c(x,c)       { return make_element_i(g_state,x,c.pos,c.end,c.match) } // type, chunk (pos,end,text)
function elem_cz(x,c)      { return make_element_i(g_state,x,c.pos,c.end) } // type, chunk (pos,end), no text
function elem_ct(x,c,t)    { return make_element_i(g_state,x,c.pos,c.end,t) } // type, chunk (pos,end) and text
function elem_cn(x,c,n)    { return make_element_i(g_state,x,c.pos,c.end,c.match.substring(n,c.match.length-n)) } // type, chunk (pos,end) and padding
function elem_pe(x,p,e)    { return make_element_i(g_state,x,p,e) } // type, pos, end (no text)
function elem_pet(x,p,e,t) { return make_element_i(g_state,x,p,e,t) } // type, pos, end, text
function elem_z(x)         { return make_element_i(g_state,x,0,0) } // type only
function add(x,d)          { return add_element(g_state,x,d) } // x is element, d (data) is optional
function ext(x)            { return extension(g_state,x) }
function ref_exists(x)     { return (get_reference(g_state,x) != null) }
function save_ref(x,e)     { return save_reference(g_state,x,e) }
function get_ref(x)        { return get_reference(g_state,x) }
function wait_ref(x,f)     { return wait_reference(g_state,x,f) }
function start()           { return before(g_state) }
function end()             { return after(g_state) }

// EXPORT ======================================================================

module.exports = {
    'elem': elem,
    'elem_c': elem_c,
    'elem_cz': elem_cz,
    'elem_ct': elem_ct,
    'elem_cn': elem_cn,
    'elem_pe': elem_pe,
    'elem_pet': elem_pet,
    'elem_z': elem_z,
    'add': add,
    'ext': ext,

    'ref_exists': ref_exists,
    'save_ref': save_ref,
    'wait_ref': wait_ref,
    'get_ref': get_ref,

    'start': start,
    'end': end,

    'state': g_state,

    'types': t,
    'exts': e,
    'TYPESTR': t.type_name,
    'EXTSTR': e.ext_name
};

