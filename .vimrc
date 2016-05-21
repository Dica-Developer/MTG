" vim:set ts=4 sts=4 sw=4 expandtab:

set expandtab
set tabstop=4
set shiftwidth=4
set softtabstop=4
set autoindent

""""""""""""""""""""""""""""""
" Command-T Setup
""""""""""""""""""""""""""""""
let g:CommandTWildIgnore=&wildignore . ",*/node_modules,*/build,*/dist"
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" SWITCH BETWEEN TEST AND PRODUCTION CODE
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
function! OpenTestAlternate()
    let new_file = AlternateForCurrentFile()
    exec ':e ' . new_file
endfunction
function! AlternateForCurrentFile()
    let current_file = expand("%")
    let new_file = current_file
    let in_spec = match(current_file, '^test/spec/') != -1
    let going_to_spec = !in_spec
    let in_app = match(current_file, '\<classes\>') != -1 || match(current_file, '\<controllers\>') != -1 || match(current_file, '\<directive\>') != -1 || match(current_file, '\<services\>') != -1
    if going_to_spec
        if in_app
            let new_file = substitute(new_file, '^src/js/', '','')
        end
        let new_file = substitute(new_file,'\.e\?js$', '.test.js', '')
        let new_file = 'test/spec/' . new_file
    else
        let new_file = substitute(new_file,'\.test\.js$', '.js', '')
        let new_file = substitute(new_file,'^test/spec/', '', '')
        if in_app
            let new_file = 'src/js/' . new_file
        end
    endif
    return new_file
endfunction
nnoremap <leader>. :call OpenTestAlternate()<cr>
