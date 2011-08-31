/* PEG Markdown Highlight
 * Copyright 2011 Ali Rantakari -- http://hasseg.org
 * Licensed under the GPL2+ and MIT licenses (see LICENSE for more info).
 *
 * pmd_grammar.leg
 *
 * This is a slightly adapted version of the PEG grammar from John MacFarlane's
 * peg-markdown compiler.
 */

// see parser-defs.js for the source of used functions and variables

{
   var defs = require(process.cwd() + '/parser-defs');
}

start =     Doc

Doc =       ( Block )*

// placeholder for marking locations
LocMarker = &. { return _chunk.pos; }


Block =     BlankLine*
            ( BlockQuote
            / Verbatim
            / Note
            / Reference
            / HorizontalRule
            / Heading
            / OrderedList
            / BulletList
            / HtmlBlock
            / StyleBlock
            / Para
            / Plain )

Para =      NonindentSpace Inlines BlankLine+

Plain =     Inlines

AtxInline = !Newline !(Sp? '#'* Sp Newline) Inline

AtxStart =  hashes:( "######" / "#####" / "####" / "###" / "##" / "#" )
            { return (pmd_H1 + (hashes.length - 1)); }

AtxHeading = hx:AtxStart Sp? ( AtxInline )+ (Sp? '#'* Sp)? Newline
            { add(elem(hx,_chunk)); }

SetextHeading = SetextHeading1 / SetextHeading2

SetextBottom1 = "===" '='* Newline

SetextBottom2 = "---" '-'* Newline

SetextHeading1 =  &(RawLine SetextBottom1)
                  s:LocMarker
                  ( !Endline Inline )+ Sp? Newline
                  SetextBottom1
                  { ADD(elem_pe(pmd_H1,s,_chunk.end)); }

SetextHeading2 =  &(RawLine SetextBottom2)
                  s:LocMarker
                  ( !Endline Inline )+ Sp? Newline
                  SetextBottom2
                  { ADD(elem_pe(pmd_H2,s,_chunk.end)); }

Heading = SetextHeading / AtxHeading

BlockQuote = a:BlockQuoteRaw
            /*{ var rawlist = elem_z(pmd_RAW_LIST);
              rawlist.children = reverse(a);
              ADD(rawlist);
              console.log('BlockQuote', rawlist);

              ADD(elem(pmd_BLOCKQUOTE,)
            }*/

BlockQuoteRaw =  a:StartList
                 (( ( '>' ' '?  /*{ return _chunk.pos; }*/) Line /*{ a = cons($$, a); }*/ )
                  ( !'>' !BlankLine Line /*{ a = cons($$, a); return $$; }*/ )*
                  ( (BlankLine) /*{ a = cons(etext("\n"), a); }*/ )*
                 )+
                 /*{ return _chunk.end; }*/

NonblankIndentedLine = !BlankLine IndentedLine

VerbatimChunk = ( BlankLine )*
                ( NonblankIndentedLine )+

Verbatim =     ff:( s:LocMarker
                 ( VerbatimChunk )+ )
                 /*{ ADD(elem_s(pmd_VERBATIM,s,_end)); }*/

HorizontalRule = ff:( NonindentSpace
                 ( '*' Sp '*' Sp '*' (Sp '*')*
                 / '-' Sp '-' Sp '-' (Sp '-')*
                 / '_' Sp '_' Sp '_' (Sp '_')*)
                 Sp Newline ) BlankLine+
                 /*{ ADD(elem(pmd_HRULE,_pos,_end)); }*/

Bullet = !HorizontalRule NonindentSpace ff:('+' / '*' / '-') Spacechar+
         /*{ ADD(elem(pmd_LIST_BULLET,_pos,_end)); }*/

BulletList = &Bullet (ListTight / ListLoose)

ListTight = a:StartList
            ( ListItemTight
              /*{ var el = mk_notype();
                el.children = $$;
                a = cons(el, a);
              }*/ )+
            BlankLine* !(Bullet / Enumerator)
            /*{ var cur = a;
              while (cur != null) {
                  var rawlist = elem_f(pmd_RAW_LIST);
                  rawlist.children = reverse(cur.children);
                  ADD(rawlist);
                  cur = cur.next;
              }
            }*/

ListLoose = a:StartList
            ( b:ListItem BlankLine*
              /*{ b = cons(etext("\n\n"), b); // In loose list, \n\n added to end of each element
                var el = mk_notype();
                el.children = b;
                a = cons(el, a);
              }*/ )+
            /*{ var cur = a;
              while (cur != null) {
                  var rawlist = elem_f(pmd_RAW_LIST);
                  rawlist.children = reverse(cur.children);
                  ADD(rawlist);
                  cur = cur->next;
              }
            }*/

ListItem =  ( Bullet / Enumerator )
            a:StartList
            ListBlock /*{ a = cons($$, a); }*/
            ( ListContinuationBlock /*{ a = cons($$, a); }*/ )*
            /*{ $$ = a; return $$; }*/

ListItemTight =
            ( Bullet / Enumerator )
            a:StartList
            ListBlock /*{ a = cons($$, a); }*/
            ( !BlankLine
              ListContinuationBlock /*{ a = cons($$, a); }*/ )*
            !ListContinuationBlock
            /*{ $$ = a; return $$; }*/

ListBlock = a:StartList
            !BlankLine Line /*{ a = cons($$, a); }*/
            ( ListBlockLine /*{ a = cons(elem(pmd_RAW), a); }*/ )*
            /*{ $$ = a;  return $$; }*/

ListContinuationBlock = a:StartList
                        ( ff:( BlankLine* )
                          /*{ if (fetch.length == 0)
                                a = cons(elem(pmd_SEPARATOR,_pos,_end), a);
                            else
                                a = cons(elem(pmd_RAW),_pos,_end, a);
                          }*/ )
                        ( Indent ListBlock /*{ a = cons($$, a); }*/ )+
                        /*{ $$ = a; return $$; }*/

Enumerator = NonindentSpace ff:( [0-9]+ '.' /*{ _apos = _pos; _aend = _end }*/ ) Spacechar+
             /*{ ADD(elem(pmd_LIST_ENUMERATOR,_apos,_aend)); }*/

OrderedList = &Enumerator (ListTight / ListLoose)

ListBlockLine = !BlankLine
                !( Indent? (Bullet / Enumerator) )
                !HorizontalRule
                OptionallyIndentedLine

// Parsers for different kinds of block-level HTML content.
// This is repetitive due to constraints of PEG grammar.

HtmlBlockOpenAddress = '<' Spnl ("address" / "ADDRESS") Spnl HtmlAttribute* '>'
HtmlBlockCloseAddress = '<' Spnl '/' ("address" / "ADDRESS") Spnl '>'
HtmlBlockAddress = HtmlBlockOpenAddress (HtmlBlockAddress / !HtmlBlockCloseAddress .)* HtmlBlockCloseAddress

HtmlBlockOpenBlockquote = '<' Spnl ("blockquote" / "BLOCKQUOTE") Spnl HtmlAttribute* '>'
HtmlBlockCloseBlockquote = '<' Spnl '/' ("blockquote" / "BLOCKQUOTE") Spnl '>'
HtmlBlockBlockquote = HtmlBlockOpenBlockquote (HtmlBlockBlockquote / !HtmlBlockCloseBlockquote .)* HtmlBlockCloseBlockquote

HtmlBlockOpenCenter = '<' Spnl ("center" / "CENTER") Spnl HtmlAttribute* '>'
HtmlBlockCloseCenter = '<' Spnl '/' ("center" / "CENTER") Spnl '>'
HtmlBlockCenter = HtmlBlockOpenCenter (HtmlBlockCenter / !HtmlBlockCloseCenter .)* HtmlBlockCloseCenter

HtmlBlockOpenDir = '<' Spnl ("dir" / "DIR") Spnl HtmlAttribute* '>'
HtmlBlockCloseDir = '<' Spnl '/' ("dir" / "DIR") Spnl '>'
HtmlBlockDir = HtmlBlockOpenDir (HtmlBlockDir / !HtmlBlockCloseDir .)* HtmlBlockCloseDir

HtmlBlockOpenDiv = '<' Spnl ("div" / "DIV") Spnl HtmlAttribute* '>'
HtmlBlockCloseDiv = '<' Spnl '/' ("div" / "DIV") Spnl '>'
HtmlBlockDiv = HtmlBlockOpenDiv (HtmlBlockDiv / !HtmlBlockCloseDiv .)* HtmlBlockCloseDiv

HtmlBlockOpenDl = '<' Spnl ("dl" / "DL") Spnl HtmlAttribute* '>'
HtmlBlockCloseDl = '<' Spnl '/' ("dl" / "DL") Spnl '>'
HtmlBlockDl = HtmlBlockOpenDl (HtmlBlockDl / !HtmlBlockCloseDl .)* HtmlBlockCloseDl

HtmlBlockOpenFieldset = '<' Spnl ("fieldset" / "FIELDSET") Spnl HtmlAttribute* '>'
HtmlBlockCloseFieldset = '<' Spnl '/' ("fieldset" / "FIELDSET") Spnl '>'
HtmlBlockFieldset = HtmlBlockOpenFieldset (HtmlBlockFieldset / !HtmlBlockCloseFieldset .)* HtmlBlockCloseFieldset

HtmlBlockOpenForm = '<' Spnl ("form" / "FORM") Spnl HtmlAttribute* '>'
HtmlBlockCloseForm = '<' Spnl '/' ("form" / "FORM") Spnl '>'
HtmlBlockForm = HtmlBlockOpenForm (HtmlBlockForm / !HtmlBlockCloseForm .)* HtmlBlockCloseForm

HtmlBlockOpenH1 = '<' Spnl ("h1" / "H1") Spnl HtmlAttribute* '>'
HtmlBlockCloseH1 = '<' Spnl '/' ("h1" / "H1") Spnl '>'
HtmlBlockH1 = ff:( s:LocMarker HtmlBlockOpenH1 (HtmlBlockH1 / !HtmlBlockCloseH1 .)* HtmlBlockCloseH1 )
                { ADD(elem_s(pmd_H1,s,_end)); }

HtmlBlockOpenH2 = '<' Spnl ("h2" / "H2") Spnl HtmlAttribute* '>'
HtmlBlockCloseH2 = '<' Spnl '/' ("h2" / "H2") Spnl '>'
HtmlBlockH2 = ff:( s:LocMarker HtmlBlockOpenH2 (HtmlBlockH2 / !HtmlBlockCloseH2 .)* HtmlBlockCloseH2 )
                { ADD(elem_s(pmd_H2,s,_end)); }

HtmlBlockOpenH3 = '<' Spnl ("h3" / "H3") Spnl HtmlAttribute* '>'
HtmlBlockCloseH3 = '<' Spnl '/' ("h3" / "H3") Spnl '>'
HtmlBlockH3 = ff:( s:LocMarker HtmlBlockOpenH3 (HtmlBlockH3 / !HtmlBlockCloseH3 .)* HtmlBlockCloseH3 )
                { ADD(elem_s(pmd_H3,s,_end)); }

HtmlBlockOpenH4 = '<' Spnl ("h4" / "H4") Spnl HtmlAttribute* '>'
HtmlBlockCloseH4 = '<' Spnl '/' ("h4" / "H4") Spnl '>'
HtmlBlockH4 = ff:( s:LocMarker HtmlBlockOpenH4 (HtmlBlockH4 / !HtmlBlockCloseH4 .)* HtmlBlockCloseH4 )
                { ADD(elem_s(pmd_H4,s,_end)); }

HtmlBlockOpenH5 = '<' Spnl ("h5" / "H5") Spnl HtmlAttribute* '>'
HtmlBlockCloseH5 = '<' Spnl '/' ("h5" / "H5") Spnl '>'
HtmlBlockH5 = ff:( s:LocMarker HtmlBlockOpenH5 (HtmlBlockH5 / !HtmlBlockCloseH5 .)* HtmlBlockCloseH5 )
                { ADD(elem_s(pmd_H5,s,_end)); }

HtmlBlockOpenH6 = '<' Spnl ("h6" / "H6") Spnl HtmlAttribute* '>'
HtmlBlockCloseH6 = '<' Spnl '/' ("h6" / "H6") Spnl '>'
HtmlBlockH6 = ff:( s:LocMarker HtmlBlockOpenH6 (HtmlBlockH6 / !HtmlBlockCloseH6 .)* HtmlBlockCloseH6 )
                { ADD(elem_s(pmd_H6,s,_end)); }

HtmlBlockOpenMenu = '<' Spnl ("menu" / "MENU") Spnl HtmlAttribute* '>'
HtmlBlockCloseMenu = '<' Spnl '/' ("menu" / "MENU") Spnl '>'
HtmlBlockMenu = HtmlBlockOpenMenu (HtmlBlockMenu / !HtmlBlockCloseMenu .)* HtmlBlockCloseMenu

HtmlBlockOpenNoframes = '<' Spnl ("noframes" / "NOFRAMES") Spnl HtmlAttribute* '>'
HtmlBlockCloseNoframes = '<' Spnl '/' ("noframes" / "NOFRAMES") Spnl '>'
HtmlBlockNoframes = HtmlBlockOpenNoframes (HtmlBlockNoframes / !HtmlBlockCloseNoframes .)* HtmlBlockCloseNoframes

HtmlBlockOpenNoscript = '<' Spnl ("noscript" / "NOSCRIPT") Spnl HtmlAttribute* '>'
HtmlBlockCloseNoscript = '<' Spnl '/' ("noscript" / "NOSCRIPT") Spnl '>'
HtmlBlockNoscript = HtmlBlockOpenNoscript (HtmlBlockNoscript / !HtmlBlockCloseNoscript .)* HtmlBlockCloseNoscript

HtmlBlockOpenOl = '<' Spnl ("ol" / "OL") Spnl HtmlAttribute* '>'
HtmlBlockCloseOl = '<' Spnl '/' ("ol" / "OL") Spnl '>'
HtmlBlockOl = HtmlBlockOpenOl (HtmlBlockOl / !HtmlBlockCloseOl .)* HtmlBlockCloseOl

HtmlBlockOpenP = '<' Spnl ("p" / "P") Spnl HtmlAttribute* '>'
HtmlBlockCloseP = '<' Spnl '/' ("p" / "P") Spnl '>'
HtmlBlockP = HtmlBlockOpenP (HtmlBlockP / !HtmlBlockCloseP .)* HtmlBlockCloseP

HtmlBlockOpenPre = '<' Spnl ("pre" / "PRE") Spnl HtmlAttribute* '>'
HtmlBlockClosePre = '<' Spnl '/' ("pre" / "PRE") Spnl '>'
HtmlBlockPre = HtmlBlockOpenPre (HtmlBlockPre / !HtmlBlockClosePre .)* HtmlBlockClosePre

HtmlBlockOpenTable = '<' Spnl ("table" / "TABLE") Spnl HtmlAttribute* '>'
HtmlBlockCloseTable = '<' Spnl '/' ("table" / "TABLE") Spnl '>'
HtmlBlockTable = HtmlBlockOpenTable (HtmlBlockTable / !HtmlBlockCloseTable .)* HtmlBlockCloseTable

HtmlBlockOpenUl = '<' Spnl ("ul" / "UL") Spnl HtmlAttribute* '>'
HtmlBlockCloseUl = '<' Spnl '/' ("ul" / "UL") Spnl '>'
HtmlBlockUl = HtmlBlockOpenUl (HtmlBlockUl / !HtmlBlockCloseUl .)* HtmlBlockCloseUl

HtmlBlockOpenDd = '<' Spnl ("dd" / "DD") Spnl HtmlAttribute* '>'
HtmlBlockCloseDd = '<' Spnl '/' ("dd" / "DD") Spnl '>'
HtmlBlockDd = HtmlBlockOpenDd (HtmlBlockDd / !HtmlBlockCloseDd .)* HtmlBlockCloseDd

HtmlBlockOpenDt = '<' Spnl ("dt" / "DT") Spnl HtmlAttribute* '>'
HtmlBlockCloseDt = '<' Spnl '/' ("dt" / "DT") Spnl '>'
HtmlBlockDt = HtmlBlockOpenDt (HtmlBlockDt / !HtmlBlockCloseDt .)* HtmlBlockCloseDt

HtmlBlockOpenFrameset = '<' Spnl ("frameset" / "FRAMESET") Spnl HtmlAttribute* '>'
HtmlBlockCloseFrameset = '<' Spnl '/' ("frameset" / "FRAMESET") Spnl '>'
HtmlBlockFrameset = HtmlBlockOpenFrameset (HtmlBlockFrameset / !HtmlBlockCloseFrameset .)* HtmlBlockCloseFrameset

HtmlBlockOpenLi = '<' Spnl ("li" / "LI") Spnl HtmlAttribute* '>'
HtmlBlockCloseLi = '<' Spnl '/' ("li" / "LI") Spnl '>'
HtmlBlockLi = HtmlBlockOpenLi (HtmlBlockLi / !HtmlBlockCloseLi .)* HtmlBlockCloseLi

HtmlBlockOpenTbody = '<' Spnl ("tbody" / "TBODY") Spnl HtmlAttribute* '>'
HtmlBlockCloseTbody = '<' Spnl '/' ("tbody" / "TBODY") Spnl '>'
HtmlBlockTbody = HtmlBlockOpenTbody (HtmlBlockTbody / !HtmlBlockCloseTbody .)* HtmlBlockCloseTbody

HtmlBlockOpenTd = '<' Spnl ("td" / "TD") Spnl HtmlAttribute* '>'
HtmlBlockCloseTd = '<' Spnl '/' ("td" / "TD") Spnl '>'
HtmlBlockTd = HtmlBlockOpenTd (HtmlBlockTd / !HtmlBlockCloseTd .)* HtmlBlockCloseTd

HtmlBlockOpenTfoot = '<' Spnl ("tfoot" / "TFOOT") Spnl HtmlAttribute* '>'
HtmlBlockCloseTfoot = '<' Spnl '/' ("tfoot" / "TFOOT") Spnl '>'
HtmlBlockTfoot = HtmlBlockOpenTfoot (HtmlBlockTfoot / !HtmlBlockCloseTfoot .)* HtmlBlockCloseTfoot

HtmlBlockOpenTh = '<' Spnl ("th" / "TH") Spnl HtmlAttribute* '>'
HtmlBlockCloseTh = '<' Spnl '/' ("th" / "TH") Spnl '>'
HtmlBlockTh = HtmlBlockOpenTh (HtmlBlockTh / !HtmlBlockCloseTh .)* HtmlBlockCloseTh

HtmlBlockOpenThead = '<' Spnl ("thead" / "THEAD") Spnl HtmlAttribute* '>'
HtmlBlockCloseThead = '<' Spnl '/' ("thead" / "THEAD") Spnl '>'
HtmlBlockThead = HtmlBlockOpenThead (HtmlBlockThead / !HtmlBlockCloseThead .)* HtmlBlockCloseThead

HtmlBlockOpenTr = '<' Spnl ("tr" / "TR") Spnl HtmlAttribute* '>'
HtmlBlockCloseTr = '<' Spnl '/' ("tr" / "TR") Spnl '>'
HtmlBlockTr = HtmlBlockOpenTr (HtmlBlockTr / !HtmlBlockCloseTr .)* HtmlBlockCloseTr

HtmlBlockOpenScript = '<' Spnl ("script" / "SCRIPT") Spnl HtmlAttribute* '>'
HtmlBlockCloseScript = '<' Spnl '/' ("script" / "SCRIPT") Spnl '>'
HtmlBlockScript = HtmlBlockOpenScript (!HtmlBlockCloseScript .)* HtmlBlockCloseScript

HtmlBlockInTags = HtmlBlockAddress
                / HtmlBlockBlockquote
                / HtmlBlockCenter
                / HtmlBlockDir
                / HtmlBlockDiv
                / HtmlBlockDl
                / HtmlBlockFieldset
                / HtmlBlockForm
                / HtmlBlockH1
                / HtmlBlockH2
                / HtmlBlockH3
                / HtmlBlockH4
                / HtmlBlockH5
                / HtmlBlockH6
                / HtmlBlockMenu
                / HtmlBlockNoframes
                / HtmlBlockNoscript
                / HtmlBlockOl
                / HtmlBlockP
                / HtmlBlockPre
                / HtmlBlockTable
                / HtmlBlockUl
                / HtmlBlockDd
                / HtmlBlockDt
                / HtmlBlockFrameset
                / HtmlBlockLi
                / HtmlBlockTbody
                / HtmlBlockTd
                / HtmlBlockTfoot
                / HtmlBlockTh
                / HtmlBlockThead
                / HtmlBlockTr
                / HtmlBlockScript

HtmlBlock = ( HtmlBlockInTags / HtmlComment / HtmlBlockSelfClosing )
            BlankLine+

HtmlBlockSelfClosing = '<' Spnl HtmlBlockType Spnl HtmlAttribute* '/' Spnl '>'

HtmlBlockType = "address" / "blockquote" / "center" / "dir" / "div" / "dl" / "fieldset" / "form" / "h1" / "h2" / "h3" /
                "h4" / "h5" / "h6" / "hr" / "isindex" / "menu" / "noframes" / "noscript" / "ol" / "p" / "pre" / "table" /
                "ul" / "dd" / "dt" / "frameset" / "li" / "tbody" / "td" / "tfoot" / "th" / "thead" / "tr" / "script" /
                "ADDRESS" / "BLOCKQUOTE" / "CENTER" / "DIR" / "DIV" / "DL" / "FIELDSET" / "FORM" / "H1" / "H2" / "H3" /
                "H4" / "H5" / "H6" / "HR" / "ISINDEX" / "MENU" / "NOFRAMES" / "NOSCRIPT" / "OL" / "P" / "PRE" / "TABLE" /
                "UL" / "DD" / "DT" / "FRAMESET" / "LI" / "TBODY" / "TD" / "TFOOT" / "TH" / "THEAD" / "TR" / "SCRIPT"

StyleOpen =     '<' Spnl ("style" / "STYLE") Spnl HtmlAttribute* '>'
StyleClose =    '<' Spnl '/' ("style" / "STYLE") Spnl '>'
InStyleTags =   StyleOpen (!StyleClose .)* StyleClose
StyleBlock =    InStyleTags
                BlankLine*

Inlines  =  ( !Endline Inline
              / Endline &Inline )+ Endline?

Inline  = Str
        / Endline
        / UlOrStarLine
        / Space
        / Strong
        / Emph
        / Image
        / Link
        / NoteReference
        / InlineNote
        / Code
        / RawHtml
        / Entity
        / EscapedChar
        / Symbol

Space = Spacechar+

Str = NormalChar (NormalChar / '_'+ &Alphanumeric)*

EscapedChar =   '\\' !Newline [-\\`|*_{}[\]()#+.!><]

Entity =    ff:( s:LocMarker
            ( HexEntity / DecEntity / CharEntity ) )
            /*{ ADD(elem_s(pmd_HTML_ENTITY,s,_end)); }*/

Endline =   LineBreak / TerminalEndline / NormalEndline

NormalEndline =   Sp Newline !BlankLine !'>' !AtxStart
                  !(Line ("===" '='* / "---" '-'*) Newline)

TerminalEndline = Sp Newline Eof

LineBreak = "  " NormalEndline

Symbol =    SpecialChar

// This keeps the parser from getting bogged down on long strings of '*' or '_',
// or strings of '*' or '_' with space on each side:
UlOrStarLine =  (UlLine / StarLine)
StarLine =      "****" '*'* / Spacechar '*'+ &Spacechar
UlLine   =      "____" '_'* / Spacechar '_'+ &Spacechar

Emph =      EmphStar / EmphUl

OneStarOpen  =  !StarLine ff:( '*' ) !Spacechar !Newline /*{ $$ = elem(pmd_NO_TYPE,_pos,_end); }*/
OneStarClose =  !Spacechar !Newline Inline !StrongStar ff:( '*' ) /*{ $$ = elem(pmd_NO_TYPE,_pos,_end); return $$; }*/

EmphStar =  s:OneStarOpen
            ( !OneStarClose Inline )*
            OneStarClose
            /*{ ADD(elem_s(pmd_EMPH,s,_end)); }*/

OneUlOpen  =  !UlLine ff:( '_' ) !Spacechar !Newline /*{ $$ = elem(pmd_NO_TYPE); }*/
OneUlClose =  !Spacechar !Newline Inline !StrongUl ff:( '_' ) !Alphanumeric /*{ $$ = elem(pmd_NO_TYPE); }*/

EmphUl =    s:OneUlOpen
            ( !OneUlClose Inline )*
            OneUlClose
            /*{ ADD(elem_s(pmd_EMPH,s,_end)); }*/

Strong = StrongStar / StrongUl

TwoStarOpen =   !StarLine ff:( "**" ) !Spacechar !Newline /*{ $$ = elem(pmd_NO_TYPE); }*/
TwoStarClose =  !Spacechar !Newline Inline ff:( "**" ) /*{ $$ = elem(pmd_NO_TYPE); }*/

StrongStar =    s:TwoStarOpen
                ( !TwoStarClose Inline )*
                TwoStarClose
                /*{ ADD(elem_s(pmd_STRONG)); }*/

TwoUlOpen =     !UlLine ff:( "__" ) !Spacechar !Newline /*{ $$ = elem(pmd_NO_TYPE); }*/
TwoUlClose =    !Spacechar !Newline Inline ff:( "__" ) !Alphanumeric /*{ $$ = elem(pmd_NO_TYPE); }*/

StrongUl =  s:TwoUlOpen
            ( !TwoUlClose Inline )*
            TwoUlClose
            /*{ ADD(elem_s(pmd_STRONG)); }*/

Image = '!' ( ExplicitLink / ReferenceLink )
        /*{
            if ($$ != NULL) {
                $$->type = pmd_IMAGE;
                $$->pos -= 1;
                ADD($$);
            }
        }*/

Link =  ( ExplicitLink / ReferenceLink / AutoLink )
        /*{ if ($$) ADD($$); }*/ // AutoLink does not return $$

ReferenceLink = ReferenceLinkDouble / ReferenceLinkSingle

ReferenceLinkDouble =  ff:( s:Label Spnl !"[]" l:Label )
                        /*{
                        	pmd_realelement *reference = GET_REF(l->label);
                            if (reference) {
                                $$ = elem_s(pmd_LINK);
                                $$->label = strdup(l->label);
                                $$->address = strdup(reference->address);
                            } else
                                $$ = NULL;
                            FREE_LABEL(s);
                            FREE_LABEL(l);
                        }*/

ReferenceLinkSingle =  ff:( s:Label (Spnl "[]")? )
                        /*{
                        	pmd_realelement *reference = GET_REF(s->label);
                            if (reference) {
                                $$ = elem_s(pmd_LINK);
                                $$->label = strdup(s->label);
                                $$->address = strdup(reference->address);
                            } else
                                $$ = NULL;
                            FREE_LABEL(s);
                        }*/

ExplicitLink =  ff:( s:Label Spnl '(' Sp l:Source Spnl Title Sp ')' )
                /*{
                    $$ = elem_s(pmd_LINK);
                    $$->address = strdup(l->address);
                    FREE_LABEL(s);
                    FREE_ADDRESS(l);
                }*/

Source  = /*{ $$ = mk_notype(); }*/
          ( '<' ff:( SourceContents ) /*{ $$->address = strdup(yytext); }*/ '>'
          / ff:( SourceContents ) /*{ $$->address = strdup(yytext); }*/ )

SourceContents = ( ( !'(' !')' !'>' Nonspacechar )+ / '(' SourceContents ')')*

Title = ( TitleSingle / TitleDouble / "" )

TitleSingle = '\'' ( !( '\'' Sp ( ')' / Newline ) ) . )* '\''

TitleDouble = '"' ( !( '"' Sp ( ')' / Newline ) ) . )* '"'

AutoLink = AutoLinkUrl / AutoLinkEmail

AutoLinkUrl =  ff:( s:LocMarker /*{ s->type = pmd_AUTO_LINK_URL; }*/
               '<'
                 ff:( [A-Za-z]+ "://" ( !Newline !'>' . )+ )
                 /*{ s->address = strdup(yytext); }*/
               '>' )
               /*{
                s->end = thunk->end;
                ADD(s);
               }*/

AutoLinkEmail = ff:( s:LocMarker /*{ s->type = pmd_AUTO_LINK_EMAIL; }*/
                '<'
                  ff:( [-A-Za-z0-9+_.]+ '@' ( !Newline !'>' . )+ )
                  /*{ s->address = strdup(yytext); }*/
                '>' )
               /*{
                s->end = thunk->end;
                ADD(s);
               }*/

Reference = ff:( s:LocMarker
              NonindentSpace !"[]" l:Label ':' Spnl r:RefSrc RefTitle ) BlankLine+
              /*{
                pmd_realelement *el = elem_s(pmd_REFERENCE);
                el->label = strdup(l->label);
                el->address = strdup(r->address);
                ADD(el);
                FREE_LABEL(l);
                FREE_ADDRESS(r);
              }*/

Label = ff:( s:LocMarker
        '[' ( !'^' &{ defs.ext(pmd_EXT_FOOTNOTES) } / &. &{ !defs.ext(pmd_EXT_FOOTNOTES) } )
        ff:( ( !']' Inline )* )
        /*{ s->label = strdup(yytext); }*/
        ']' )
        /*{
            s->pos = s->pos;
            s->end = thunk->end;
            $$ = s;
        }*/

RefSrc = ff:( Nonspacechar+ )
		 /*{ $$ = mk_notype(); $$->address = strdup(yytext); }*/

RefTitle =  ( RefTitleSingle / RefTitleDouble / RefTitleParens / EmptyTitle )

EmptyTitle = ""

RefTitleSingle = Spnl '\'' ( !('\'' Sp Newline / Newline ) . )* '\''

RefTitleDouble = Spnl '"' ( !('"' Sp Newline / Newline) . )* '"'

RefTitleParens = Spnl '(' ( !(')' Sp Newline / Newline) . )* ')'

// Starting point for parsing only references:
References = ( Reference / SkipBlock )*

Ticks1 = ff:( "`" ) !'`' /*{ $$ = elem(pmd_NO_TYPE); }*/
Ticks2 = ff:( "``" ) !'`' /*{ $$ = elem(pmd_NO_TYPE); }*/
Ticks3 = ff:( "```" ) !'`' /*{ $$ = elem(pmd_NO_TYPE); }*/
Ticks4 = ff:( "````" ) !'`' /*{ $$ = elem(pmd_NO_TYPE); }*/
Ticks5 = ff:( "`````" ) !'`' /*{ $$ = elem(pmd_NO_TYPE); }*/

Code = ff:( ( s:Ticks1 Sp ( ( !'`' Nonspacechar )+ / !Ticks1 '`'+ / !( Sp Ticks1 ) ( Spacechar / Newline !BlankLine ) )+ Sp Ticks1
       / s:Ticks2 Sp ( ( !'`' Nonspacechar )+ / !Ticks2 '`'+ / !( Sp Ticks2 ) ( Spacechar / Newline !BlankLine ) )+ Sp Ticks2
       / s:Ticks3 Sp ( ( !'`' Nonspacechar )+ / !Ticks3 '`'+ / !( Sp Ticks3 ) ( Spacechar / Newline !BlankLine ) )+ Sp Ticks3
       / s:Ticks4 Sp ( ( !'`' Nonspacechar )+ / !Ticks4 '`'+ / !( Sp Ticks4 ) ( Spacechar / Newline !BlankLine ) )+ Sp Ticks4
       / s:Ticks5 Sp ( ( !'`' Nonspacechar )+ / !Ticks5 '`'+ / !( Sp Ticks5 ) ( Spacechar / Newline !BlankLine ) )+ Sp Ticks5
       ) )
       /*{ ADD(elem_s(pmd_CODE)); }*/

RawHtml =   (HtmlComment / HtmlBlockScript / HtmlTag)

BlankLine =     Sp Newline

Quoted =        '"' (!'"' .)* '"' / '\'' (!'\'' .)* '\''
HtmlAttribute = (AlphanumericAscii / '-')+ Spnl ('=' Spnl (Quoted / (!'>' Nonspacechar)+))? Spnl
HtmlComment =   ff:( s:LocMarker "<!--" (!"-->" .)* "-->" )
                /*{ ADD(elem_s(pmd_COMMENT)); }*/
HtmlTag =       '<' Spnl '/'? AlphanumericAscii+ Spnl HtmlAttribute* '/'? Spnl '>'
Eof =           !.
Spacechar =     ' ' / '\t'
Nonspacechar =  !Spacechar !Newline .
Newline =       '\n' / '\r' '\n'?
Sp =            Spacechar*
Spnl =          Sp (Newline Sp)?
SpecialChar =   '*' / '_' / '`' / '&' / '[' / ']' / '(' / ')' / '<' / '!' / '#' / '\\' / '\'' / '"' / ExtendedSpecialChar
NormalChar =    !( SpecialChar / Spacechar / Newline ) .
// Not used anywhere in grammar:
// NonAlphanumeric = [\000-\057\072-\100\133-\140\173-\177]
Alphanumeric = [0-9A-Za-z] /* / '\200' / '\201' / '\202' / '\203' / '\204' / '\205' / '\206' / '\207' / '\210' / '\211' / '\212' / '\213' / '\214' / '\215' / '\216' / '\217' / '\220' / '\221' / '\222' / '\223' / '\224' / '\225' / '\226' / '\227' / '\230' / '\231' / '\232' / '\233' / '\234' / '\235' / '\236' / '\237' / '\240' / '\241' / '\242' / '\243' / '\244' / '\245' / '\246' / '\247' / '\250' / '\251' / '\252' / '\253' / '\254' / '\255' / '\256' / '\257' / '\260' / '\261' / '\262' / '\263' / '\264' / '\265' / '\266' / '\267' / '\270' / '\271' / '\272' / '\273' / '\274' / '\275' / '\276' / '\277' / '\300' / '\301' / '\302' / '\303' / '\304' / '\305' / '\306' / '\307' / '\310' / '\311' / '\312' / '\313' / '\314' / '\315' / '\316' / '\317' / '\320' / '\321' / '\322' / '\323' / '\324' / '\325' / '\326' / '\327' / '\330' / '\331' / '\332' / '\333' / '\334' / '\335' / '\336' / '\337' / '\340' / '\341' / '\342' / '\343' / '\344' / '\345' / '\346' / '\347' / '\350' / '\351' / '\352' / '\353' / '\354' / '\355' / '\356' / '\357' / '\360' / '\361' / '\362' / '\363' / '\364' / '\365' / '\366' / '\367' / '\370' / '\371' / '\372' / '\373' / '\374' / '\375' / '\376' / '\377' */
AlphanumericAscii = [A-Za-z0-9]

HexEntity =     '&' '#' [Xx] [0-9a-fA-F]+ ';'
DecEntity =     '&' '#' [0-9]+ ';'
CharEntity =    '&' [A-Za-z0-9]+ ';'

NonindentSpace =    "   " / "  " / " " / ""
Indent =            "\t" / "    "
IndentedLine =      Indent Line
OptionallyIndentedLine = Indent? Line

// StartList starts a list data structure that can be added to with cons:
StartList = &.
            /*{ $$ = NULL; }*/

Line =  RawLine
       /*{ $$ = mk_element((parser_data *)G->data, pmd_RAW, $$->pos, $$->end); }*/

RawLine = ( ff:( (!'\r' !'\n' .)* Newline ) / ff:( .+ ) Eof )
          /*{ $$ = elem(pmd_RAW); }*/

SkipBlock = ( !BlankLine RawLine )+ BlankLine*
          / BlankLine+

// Syntax extensions

ExtendedSpecialChar = &{ defs.ext(pmd_EXT_FOOTNOTES) } ( '^' )

NoteReference = &{ defs.ext(pmd_EXT_FOOTNOTES) }
                RawNoteReference

RawNoteReference = "[^" ( !Newline !']' . )+ ']'

Note =          &{ defs.ext(pmd_EXT_FOOTNOTES) }
                NonindentSpace RawNoteReference ':' Sp
                ( RawNoteBlock )
                ( &Indent RawNoteBlock )*

InlineNote =    &{ defs.ext(pmd_EXT_FOOTNOTES) }
                "^["
                ( !']' Inline )+
                ']'

// Not used anywhere in grammar:
// Notes =         ( Note / SkipBlock )*

RawNoteBlock =  ( !BlankLine OptionallyIndentedLine )+
                ( BlankLine* )

