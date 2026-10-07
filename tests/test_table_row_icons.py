import importlib.util, os; from pathlib import Path; from types import SimpleNamespace; from unittest.mock import patch
S=importlib.util.spec_from_file_location("table_row_icons",Path(__file__).resolve().parents[1]/"src/typeset/components/table/table.py"); T=importlib.util.module_from_spec(S); S.loader.exec_module(T)
def context(orient,issues): return SimpleNamespace(orient=orient,min_font=16,inline=lambda x:x,take_icons=lambda n,s: s["icons"][:n],resolve=lambda p:p,incomplete=lambda m,k:issues.append((m,k)))
def test_icons_align_and_preserve_text():
    node={"header":["名称","值"],"rows":[["甲","A"],["乙","B"]]}; paths=["icon-0.svg","icon-1.svg"]
    for orient in ("h","v"):
        issues=[]; c=context(orient,issues)
        with patch.object(os.path,"isfile",return_value=True): out=T._table(node,c,{"icons":paths})
        assert all(x in out for x in ("名称","值","甲","A","乙","B")) and not issues
        assert out.index('data-table-row="0"')<out.index('src="icon-0.svg"')<out.index("甲")<out.index('data-table-row="1"')<out.index('src="icon-1.svg"')<out.index("乙")
    for icons,exists in ((["icon-0.svg"],True),(paths,False)):
        issues=[]; c=context("h",issues)
        with patch.object(os.path,"isfile",return_value=exists): out=T._table(node,c,{"icons":icons})
        assert issues and issues[0][1]=="asset" and "甲" in out and 'class="table-row-icon"' not in out
    assert T._table({"header":["H"],"rows":[["A"]]},context("h",[]),{})=='<div class="c-table" data-comp="table" data-orient="h" style="--table-min-font:16px"><div class="table-frame"><table class="table-grid"><colgroup><col style="width:100.00000000%"></colgroup><thead><tr><th class="tb table-cell table-left" data-table-col="0" data-table-header="true" scope="col">H</th></tr></thead><tbody><tr data-table-safe-row><td class="tb table-cell table-left" data-table-col="0" data-table-row="0">A</td></tr></tbody></table></div></div>'
