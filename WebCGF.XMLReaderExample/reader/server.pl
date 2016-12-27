:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).
:- use_module(library(random)).
:- include('utilities.pl').

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                        Server                                                   %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% To run, enter 'server.' on sicstus command line after consulting this file.
% You can test requests to this server by going to http://localhost:8081/<request>.
% Go to http://localhost:8081/quit to close server.

% Made by Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

port(8081).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

% Server Loop 
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		% write('Accepted connection'), nl,
	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			% write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),
		
		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),
		
		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: text/plain~n~n', []),
		format(Stream, '~p', [MyReply]),
	
		% write('Finnished Connection'),nl,nl,
		close_stream(Stream),
	(Request = quit), !.
	
close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK') :- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, 'Syntax Error', '400 Bad Request') :- !.
handle_request(_, 'Bad Request', '400 Bad Request').

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),
	
	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	read_request_aux(RL,RL2),	
	
	catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).
	
read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).


% Reads and Ignores the rest of the lines of the HTTP Header
read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

% Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
% print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
print_header_line(_).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here

parse_input(handshake, handshake).
parse_input(test(C,N), Res) :- test(C,Res,N).
parse_input(moveUnit(Row, Column, NewRow, NewColumn, Piece), Success) :- moveUnit(Row, Column, NewRow, NewColumn, Piece, Success).
parse_input(moveNode(Row, Column, NewRow, NewColumn, Piece), Success) :- moveNode(Row, Column, NewRow, NewColumn, Piece, Success).
parse_input(finish(Player), Answer) :- finish(Player, Answer).
parse_input(updateBoard, updated) :- updateBoard.
parse_input(init, init) :- init.
parse_input(quit, goodbye).

test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).

:- volatile state/2, 
            lineTemp/1, 
            nodePosition/2, 
            player/1,
            randlist/1,
            validateComputerList/1.

:- dynamic state/2, 
           lineTemp/1, 
           nodePosition/2,
           player/1,
           randlist/1,
           validateComputerList/1.

/*Initial Play Board: roofs are margins, null are out of the board, empty are empty, unit1 and node1 are Units and Nodes
of Player 1 and similar happens to Player 2*/
board([
        [null, null, unit1, unit1, node1, unit1, unit1, null, null],
        [null, empty, empty, unit1, unit1, unit1, empty, empty, null],
        [empty, empty, empty, empty, unit1, empty, empty, empty, empty],
        [empty, empty, empty, empty, empty, empty, empty, empty, empty],
        [empty, empty, empty, empty, empty, empty, empty, empty, empty],
        [empty, empty, empty, empty, empty, empty, empty, empty, empty],
        [empty, empty, empty, empty, unit2, empty, empty, empty, empty],
        [null, empty, empty, unit2, unit2, unit2, empty, empty, null],
        [null, null, unit2, unit2, node2, unit2, unit2, null, null]
       ]).

/*Board that contains where the Communication Lines are (signed with l)*/
lineBoard([
        [null, null, l, l, l, l, l, null, null],
        [null, empty, empty, l, l, l, empty, empty, null],
        [empty, empty, l, empty, l, empty, l, empty, empty],
        [empty, l, empty, empty, l, empty, empty, l, empty],
        [l, empty, empty, empty, l, empty, empty, empty, l],
        [empty, l, empty, empty, l, empty, empty, l, empty],
        [empty, empty, l, empty, l, empty, l, empty, empty],
        [null, empty, empty, l, l, l, empty, empty, null],
        [null, null, l, l, l, l, l, null, null]
       ]).

/*players*/
player1(p1).
player2(p2).

/*which units belong to each player*/
unitPlayer(p1,unit1).
unitPlayer(p2,unit2).

/*which node belong to each player*/
nodePlayer(p1,node1).
nodePlayer(p2,node2).

/*checks if the piece belong to the player*/
validatePiece(p1, node1).
validatePiece(p1, unit1).
validatePiece(p2, node2).
validatePiece(p2, unit2).

/*checks if it is a node*/
node(node1).
node(node2).

/*used to switch players*/
nextPlayer(p1, p2).
nextPlayer(p2, p1).

/*starting function: calls the menu and gets the type of game. Also initializes both boards.*/
init :-
        board(Board),
        lineBoard(LineBoard),
        assert(state(Board, LineBoard)),
        /*assert(player(p1)),*/
        !.

/*findUnits will find all the positions of units (unit1 OR unit2) on the board*/

findUnitsAux([], _, _, _).

findUnitsAux([Piece|T], Row, Column, Piece) :-
        retract(randlist(List)),
        append(List, [[Row, Column]], NewList),
        assert(randlist(NewList)),
        NewColumnCounter is Column + 1,
        findUnitsAux(T, Row, NewColumnCounter, Piece).

findUnitsAux([_|T], RowCounter, ColumnCounter, Piece) :-
        NewColumnCounter is ColumnCounter + 1,
        findUnitsAux(T, RowCounter, NewColumnCounter, Piece).

findUnits([], _, _, _).

findUnits([H|T], RowCounter, ColumnCounter, Piece) :-
        findUnitsAux(H, RowCounter, ColumnCounter, Piece),
        NewRowCounter is RowCounter + 1,
        findUnits(T, NewRowCounter, 1, Piece).

/*findNode will find the position of a node (node1 OR node2) on the board*/

findNodeAux([], _, _, _, _).

findNodeAux(List, NewRow, Row, Column, Piece) :-
        nth1(Column, List, Piece) ->
                Row is NewRow;
        true.
        
findNode([], _, _, _, _).

findNode([H|T], NewRow, Row, Column, Piece) :-
        findNodeAux(H, NewRow, Row, Column, Piece),
        NewTempRow is NewRow + 1,
        findNode(T, NewTempRow, Row, Column, Piece).

/*checks if the position is inside the board*/
checkPosition(Row, Column) :-
        Row > 0,
        Row < 3,
        Column > 3 - Row,
        Column < 11 - (3 - Row), 
        !.

checkPosition(Row, Column) :-
        Row > 2,
        Row < 8,
        Column > 1,
        Column < 11,
        !.

checkPosition(Row, Column) :-
        Row > 7,
        Row < 10,
        Column > Row - 6,
        Column < 10 + (8 - Row),
        !.
/*gets piece in LineBoard*/
getCommunication([H|_], 1, Column, Piece) :-
        Column > 0,
        Column < 10,
        nth1(Column, H, Piece), !.

getCommunication([_|T], Row, Column, Piece) :-
        Row > 1,
        TempRow is Row - 1,
        getCommunication(T, TempRow, Column, Piece), !.

getPiece([H|_], 1, Column, Piece) :-
        nth1(Column, H, Piece),
        !.

getPiece([_|T], Row, Column, Piece) :-
        Row > 1,
        TempRow is Row - 1,
        getPiece(T, TempRow, Column, Piece).

/*sets cell in a position of a line*/
setCellLine(1, Piece, [_|T], [Piece|T]).

setCellLine(Column, Piece, [H|T], [H|NewT]) :-
        Column > 1,
        TempColumn is Column - 1,
        setCellLine(TempColumn, Piece, T, NewT).   

/*sets cell in a board*/
setCell(1, Column, Piece, [H|T], [NewHead|T]) :-
        setCellLine(Column, Piece, H, NewHead).
        
setCell(Row, Column, Piece, [H|T], [H|NewT]) :-
        Row > 1,
        TempRow is Row - 1, 
        setCell(TempRow, Column, Piece, T, NewT).

/*checks if node can move to desired position*/
validateNodeMove(Row, Column, Row, Column, _) :- false.

validateNodeMove(Row, Column, NewRow, NewColumn, Board) :-
        NewRow is Row,
        NewColumn < Column + 2,
        NewColumn > Column - 2,
        getPiece(Board, NewRow, NewColumn, empty);
        NewRow < Row + 2,
        NewRow > Row - 2,
        NewColumn is Column,
        getPiece(Board, NewRow, NewColumn, empty).

/*checks if unit can move to desired position*/
validateUnitMoveAux(_, _, _, _, Row, Column, Row, Column, _, _).

validateUnitMoveAux(Board, LineBoard, Piece, LinePiece, Row, Column, NewRow, NewColumn, TempRow, TempColumn) :-
         (Piece == 'empty', LinePiece == 'l') ->
                setCell(Row, Column, k, LineBoard, TempLineBoard),
                setCell(Row, Column, a, Board, NewBoard),
                validateUnitMove(TempRow, TempColumn, NewRow, NewColumn, NewBoard, TempLineBoard).

validateUnitMove(Row, Column, Row, Column, _, _).

validateUnitMove(Row, Column, NewRow, NewColumn, Board, LineBoard) :-
        TempRow is Row - 1,
        getCommunication(LineBoard, Row, Column, LinePiece),
        getPiece(Board, TempRow, Column, Piece),
        validateUnitMoveAux(Board, LineBoard, Piece, LinePiece, Row, Column, NewRow, NewColumn, TempRow, Column);
        TempRow is Row + 1,
        getCommunication(LineBoard, Row, Column, LinePiece),
        getPiece(Board, TempRow, Column, Piece),
        validateUnitMoveAux(Board, LineBoard, Piece, LinePiece, Row, Column, NewRow, NewColumn, TempRow, Column);
        TempColumn is Column - 1,
        getCommunication(LineBoard, Row, Column, LinePiece),
        getPiece(Board, Row, TempColumn, Piece),
        validateUnitMoveAux(Board, LineBoard, Piece, LinePiece, Row, Column, NewRow, NewColumn, Row, TempColumn);     
        TempColumn is Column + 1,
        getCommunication(LineBoard, Row, Column, LinePiece),
        getPiece(Board, Row, TempColumn, Piece),
        validateUnitMoveAux(Board, LineBoard, Piece, LinePiece, Row, Column, NewRow, NewColumn, Row, TempColumn).


/*adds a possible position to a list*/
validateComputerUnitMoveAux(Row, Column) :-
        retract(validateComputerList(List)),
        append(List, [[Row, Column]], NewList),
        assert(validateComputerList(NewList)).

/*finds possible positions to where units can move. It is divided in four main different functions so it cannot cycle*/

validateComputerUnitMoveRIGHTAux(0, _, _, _).
validateComputerUnitMoveRIGHTAux(_, 0, _, _).
validateComputerUnitMoveRIGHTAux(10, _, _, _).
validateComputerUnitMoveRIGHTAux(_, 10, _, _).

validateComputerUnitMoveLEFTAux(0, _, _, _).
validateComputerUnitMoveLEFTAux(_, 0, _, _).
validateComputerUnitMoveLEFTAux(10, _, _, _).
validateComputerUnitMoveLEFTAux(_, 10, _, _).

validateComputerUnitMoveUPAux(0, _, _, _).
validateComputerUnitMoveUPAux(_, 0, _, _).
validateComputerUnitMoveUPAux(10, _, _, _).
validateComputerUnitMoveUPAux(_, 10, _, _).

validateComputerUnitMoveDOWNAux(0, _, _, _).
validateComputerUnitMoveDOWNAux(_, 10, _, _).
validateComputerUnitMoveDOWNAux(10, _, _, _).
validateComputerUnitMoveDOWNAux(_, 10, _, _).

validateComputerUnitMoveRIGHTAux(Row, Column, Board, LineBoard) :-
        validateComputerUnitMoveUP(Row, Column, Board, LineBoard);
        validateComputerUnitMoveDOWN(Row, Column, Board, LineBoard);
        validateComputerUnitMoveRIGHT(Row, Column, Board, LineBoard).

validateComputerUnitMoveRIGHT(Row, Column, Board, LineBoard) :-
        TempColumn is Column + 1,
        getCommunication(LineBoard, Row, Column, LinePiece),
        getPiece(Board, Row, TempColumn, Piece),
        Piece == 'empty',
        LinePiece == 'l',
        validateComputerUnitMoveAux(Row, TempColumn),
        setCell(Row, Column, a, Board, NextBoard),
        validateComputerUnitMoveRIGHTAux(Row, TempColumn, NextBoard, LineBoard).

validateComputerUnitMoveLEFTAux(Row, Column, Board, LineBoard) :-
        validateComputerUnitMoveUP(Row, Column, Board, LineBoard);
        validateComputerUnitMoveDOWN(Row, Column, Board, LineBoard);
        validateComputerUnitMoveLEFT(Row, Column, Board, LineBoard).

validateComputerUnitMoveLEFT(Row, Column, Board, LineBoard) :-
        TempColumn is Column - 1,
        getCommunication(LineBoard, Row, Column, LinePiece),
        getPiece(Board, Row, TempColumn, Piece),
        Piece == 'empty',
        LinePiece == 'l',
        validateComputerUnitMoveAux(Row, TempColumn),
        setCell(Row, Column, a, Board, NextBoard),
        validateComputerUnitMoveLEFTAux(Row, TempColumn, NextBoard, LineBoard).

validateComputerUnitMoveDOWNAux(Row, Column, Board, LineBoard) :-
        validateComputerUnitMoveDOWN(Row, Column, Board, LineBoard);
        validateComputerUnitMoveLEFT(Row, Column, Board, LineBoard);
        validateComputerUnitMoveRIGHT(Row, Column, Board, LineBoard).

validateComputerUnitMoveDOWN(Row, Column, Board, LineBoard) :-
        TempRow is Row + 1,
        getCommunication(LineBoard, Row, Column, LinePiece),
        getPiece(Board, TempRow, Column, Piece),
        Piece == 'empty',
        LinePiece == 'l',
        validateComputerUnitMoveAux(TempRow, Column),
        setCell(Row, Column, a, Board, NextBoard),
        validateComputerUnitMoveDOWNAux(TempRow, Column, NextBoard, LineBoard).

validateComputerUnitMoveUPAux(Row, Column, Board, LineBoard) :-
        validateComputerUnitMoveUP(Row, Column, Board, LineBoard);
        validateComputerUnitMoveLEFT(Row, Column, Board, LineBoard);
        validateComputerUnitMoveRIGHT(Row, Column, Board, LineBoard).

validateComputerUnitMoveUP(Row, Column, Board, LineBoard) :-
        TempRow is Row - 1,
        getCommunication(LineBoard, Row, Column, LinePiece),
        getPiece(Board, TempRow, Column, Piece),
        Piece == 'empty',
        LinePiece == 'l',
        validateComputerUnitMoveAux(TempRow, Column),
        setCell(Row, Column, a, Board, NextBoard),
        validateComputerUnitMoveUPAux(TempRow, Column, NextBoard, LineBoard).
        
validateComputerUnitMove(Row, Column, Board, LineBoard) :-
        validateComputerUnitMoveUP(Row, Column, Board, LineBoard);
        validateComputerUnitMoveDOWN(Row, Column, Board, LineBoard);
        validateComputerUnitMoveRIGHT(Row, Column, Board, LineBoard);
        validateComputerUnitMoveLEFT(Row, Column, Board, LineBoard);
        true.

/*finds next position where to draw communication line*/
newLinePosition(Row, Column, NewRow, NewColumn, VRow, VColumn) :-
        /*UP*/
        (VRow == dec, VColumn == static) ->
                NewRow is Row - 1,
                NewColumn is Column;
        /*DOWN*/
        (VRow == inc, VColumn == static) ->
                NewRow is Row + 1,
                NewColumn is Column;
        /*LEFT*/
        (VRow == static, VColumn == inc) ->
                NewRow is Row,
                NewColumn is Column + 1;
        /*RIGHT*/
        (VRow == static, VColumn == dec) ->
                NewRow is Row,
                NewColumn is Column - 1;
        /*NORTHWEST*/
        (VRow == dec, VColumn == dec) ->
                NewRow is Row - 1,
                NewColumn is Column - 1;
        /*SOUTHWEST*/
        (VRow == inc, VColumn == dec) ->
                NewRow is Row + 1,
                NewColumn is Column - 1;
        /*NORTHEAST*/
        (VRow == dec, VColumn == inc) ->
                NewRow is Row - 1,
                NewColumn is Column + 1;
        /*SOUTHEAST*/
        (VRow == inc, VColumn == inc) ->
                NewRow is Row + 1,
                NewColumn is Column + 1.


lineAux(LineBoard, Row, Column, Piece, VRow, VColumn) :-
        getPiece(LineBoard, Row, Column, NewPiece),
        NewPiece == empty ->
                setCell(Row, Column, Piece, LineBoard, NewLineBoard),
                newLinePosition(Row, Column, NewRow, NewColumn, VRow, VColumn),
                assert(lineTemp(NewLineBoard)),
                line(Piece, NewRow, NewColumn, VRow, VColumn);
        assert(lineTemp(LineBoard)),
        newLinePosition(Row, Column, NewRow, NewColumn, VRow, VColumn),
        line(Piece, NewRow, NewColumn, VRow, VColumn).

line(_,0,0,_,_).

line(Piece, Row, Column, VRow, VColumn):-
        checkPosition(Row, Column) ->
                retract(lineTemp(LineBoard)),
                lineAux(LineBoard, Row, Column, Piece, VRow, VColumn);
        true.

/*sets cell o l*/
updateLineBoardAux(Piece, Row, Column, LineBoard, NewLineBoard) :-
        assert(lineTemp(LineBoard)),
        NewRow1 is Row - 1,
        NewColumn1 is Column - 1,
        NewRow2 is Row + 1,
        NewColumn2 is Column + 1,
        /*UP row*/
        line(Piece, NewRow1, Column, dec, static),
        /*DOWN row*/
        line(Piece, NewRow2, Column, inc, static),
        /*LEFT row*/
        line(Piece, Row, NewColumn1, static, dec),
        /*RIGHT row*/
        line(Piece, Row, NewColumn2, static, inc),
        /*NORTHWEST row*/
        line(Piece, NewRow1, NewColumn1, dec, dec),
        /*SOUTHWEST row*/
        line(Piece, NewRow2, NewColumn1, inc, dec),
        /*NORTHEAST row*/
        line(Piece, NewRow1, NewColumn2, dec, inc),
        /*SOUTHEAST row*/
        line(Piece, NewRow2, NewColumn2, inc, inc),
        retract(lineTemp(NewLineBoard)).

updateLineBoard(Row, Column, LineBoard, NewLineBoard) :-
        updateLineBoardAux(l, Row, Column, LineBoard, NewLineBoard).


/*clears LineBoard: sets cells to empty*/
cleanLine([], _, _). 

cleanLine([Piece|T], Piece, [empty|NewTail]) :-
        cleanLine(T, Piece, NewTail).

cleanLine([H|T], Piece, [H|NewTail]) :-
        cleanLine(T, Piece, NewTail).

cleanBoard([], _). 

cleanBoard([E1|Es], [H|T]) :-
        cleanLine(E1, l, H),
        cleanBoard(Es, T).

updateBoard :-
            retract(state(NewBoard, LineBoard)),
            cleanBoard(LineBoard, TempLineBoard),
            findNode(NewBoard, 1, NewRow1, NewColumn1, node1),
            setCell(NewRow1, NewColumn1, l, TempLineBoard, NewTempLineBoard2),
            updateLineBoard(NewRow1, NewColumn1, NewTempLineBoard2, NewTempLineBoard3),
            findNode(NewBoard, 1, NewRow2, NewColumn2, node2),
            setCell(NewRow2, NewColumn2, l, NewTempLineBoard3, NewTempLineBoard),
            updateLineBoard(NewRow2, NewColumn2, NewTempLineBoard, NewLineBoard),
            assert(state(NewBoard, NewLineBoard)).
            /*assert(nodePosition(NewBoard, NewLineBoard)).*/

moveNode(Row, Column, NewRow, NewColumn, Piece, 1) :-
        retract(state(Board, LineBoard)),
        assert(state(Board, LineBoard)),
        validateNodeMove(Row, Column, NewRow, NewColumn, Board),
        setCell(Row, Column, empty, Board, NewBoardTemp),
        setCell(NewRow, NewColumn, Piece, NewBoardTemp, NewBoard),
        retract(state(Board, LineBoard)),
        assert(state(NewBoard, LineBoard)), 
        !,
        updateBoard.

moveNode(_, _, _, _, _, 0) :- !.

moveUnit(Row, Column, NewRow, NewColumn, Piece, 1) :-
        retract(state(Board, LineBoard)),
        assert(state(Board, LineBoard)),
        validateUnitMove(Row, Column, NewRow, NewColumn, Board, LineBoard),
        setCell(Row, Column, empty, Board, NewBoardTemp),
        setCell(NewRow, NewColumn, Piece, NewBoardTemp, NewBoard),
        retract(state(Board, LineBoard)),
        assert(state(NewBoard, LineBoard)),
        !.

moveUnit(_, _, _, _, _, 0) :- !.

move(Piece, Row, Column, NewRow, NewColumn, Board, LineBoard, Piece, Finish) :-
        node(Piece),
        moveNode(Row, Column, NewRow, NewColumn, Board, LineBoard, Piece, Finish).

move(Piece, Row, Column, NewRow, NewColumn, Board, LineBoard, Piece, Finish) :-
        moveUnit(Row, Column, NewRow, NewColumn, Board, LineBoard, Piece, Finish).

readMove(Player, Board, LineBoard, Piece, Row, Column) :-
        nl, displayBoard(Board, LineBoard),
        repeat,
                nl, write('Row: '),
                read(Row),
                write('Column: '),
                read(TempColumn),
                Column is TempColumn + 1,
                checkPosition(Row, Column),
                getPiece(Board, Row, Column, Piece),
                validatePiece(Player, Piece),
                !.

nextMove(Player) :-
        repeat,
                retract(state(Board, LineBoard)),
                readMove(Player, Board, LineBoard, Piece, Row, Column), nl,
                write('Where to:'), nl,
                write('Row: '),
                read(NewRow),
                write('Column: '),
                read(TempNewColumn), nl,
                NewColumn is TempNewColumn + 1,
                checkPosition(NewRow, NewColumn),
                move(Piece, Row, Column, NewRow, NewColumn, Board, LineBoard, Piece, Finish),
                finishMove(Piece, Finish),
                !.

/*finish(Player, Board, Answer):-
        nextPlayer(Player, Next),
        nodePlayer(Next, Node),
        findNode(Board, 1, Row, Column, Node),
        unitPlayer(Player, Piece),
        NewRow1 is Row - 1,
        NewColumn1 is Column - 1,
        NewRow2 is Row + 1,
        NewColumn2 is Column + 1,
        getPiece(Board, NewRow1, Column, Piece),
        getPiece(Board, NewRow2, Column, Piece),
        getPiece(Board, Row, NewColumn1, Piece),
        getPiece(Board, Row, NewColumn2, Piece).*/

finish(Player, 0):-
        retract(state(Board, LineBoard)),
        assert(state(Board, LineBoard)),
        nextPlayer(Player, Next),
        nodePlayer(Next, Node),
        findNode(Board, 1, Row, Column, Node),
        unitPlayer(Player, Piece),
        NewRow1 is Row - 1,
        \+ getPiece(Board, NewRow1, Column, Piece), !.

finish(Player, 0) :-
        retract(state(Board, LineBoard)),
        assert(state(Board, LineBoard)),
        nextPlayer(Player, Next),
        nodePlayer(Next, Node),
        findNode(Board, 1, Row, Column, Node),
        unitPlayer(Player, Piece),
        NewColumn1 is Column - 1,
        \+ getPiece(Board, Row, NewColumn1, Piece), !.

finish(Player, 0) :-
        retract(state(Board, LineBoard)),
        assert(state(Board, LineBoard)),
        nextPlayer(Player, Next),
        nodePlayer(Next, Node),
        findNode(Board, 1, Row, Column, Node),
        unitPlayer(Player, Piece),
        NewRow2 is Row + 1,
        \+ getPiece(Board, NewRow2, Column, Piece), !.

finish(Player, 0) :-
        retract(state(Board, LineBoard)),
        assert(state(Board, LineBoard)),
        nextPlayer(Player, Next),
        nodePlayer(Next, Node),
        findNode(Board, 1, Row, Column, Node),
        unitPlayer(Player, Piece),
        NewColumn2 is Column + 1,
        \+ getPiece(Board, Row, NewColumn2, Piece), !.

finish(_, 1) :- !.

play(Type) :-
        Type =:= 1 -> playHH;
        Type =:= 2 -> playHC;
        Type =:= 3 -> playCC.

playHH :-
        repeat,
                retract(player(Player)), nl,
                write('Player: '), write(Player), nl, nl,
                nextMove(Player),
                retract(nodePosition(Board, NewLineBoard)),
                nextPlayer(Player, Next),
                assert(player(Next)),
                finish(Player, Board),
                displayBoard(Board, NewLineBoard),
                !.

moveRanUnitAux(Row, Column, LengthMoves, Moves, Piece) :-
        LengthMoves \== 0 ->
                retract(state(Board, LineBoard)),
                Length is LengthMoves + 1,
                random(1, Length, Move),
                nth1(Move, Moves, NewPos),
                nth1(1, NewPos, FinalRow),
                nth1(2, NewPos, FinalColumn),
                moveUnit(Row, Column, FinalRow, FinalColumn, Board, LineBoard, Piece, _);
        true.

moveRandUnit([], _).
                                                                    
moveRandUnit([L1|Ls],Piece):-
        nth1(1, L1, Row),
        nth1(2, L1, Column),
        retract(state(Board, LineBoard)),
        assert(validateComputerList([])),
        validateComputerUnitMove(Row, Column, Board, LineBoard),
        assert(state(Board, LineBoard)),
        retract(validateComputerList(Moves)),
        length(Moves, LengthMoves),
        moveRanUnitAux(Row, Column, LengthMoves, Moves, Piece),
        moveRandUnit(Ls,Piece).

randPlayAux(NodeRow, NodeColumn, Board, LineBoard, NodeMoves, Piece) :-
        length(NodeMoves, LengthNodeMoves),
        LengthNodeMoves \== 0 ->
                Length is LengthNodeMoves + 1,
                random(1, Length, NodeMove),
                nth1(NodeMove, NodeMoves,NewNodePos),
                nth1(1, NewNodePos, FinalNodeRow),
                nth1(2, NewNodePos, FinalNodeColumn),
                moveNode(NodeRow, NodeColumn, FinalNodeRow, FinalNodeColumn, Board, LineBoard, Piece, _),
                retract(state(TempBoard, TempLineBoard)),
                assert(nodePosition(TempBoard, TempLineBoard)),
                assert(state(TempBoard, TempLineBoard));
        assert(state(Board, LineBoard)),
        assert(nodePosition(Board, LineBoard)).
        
randPlay(Player):- 
        retract(state(Board, LineBoard)),

        unitPlayer(Player, Piece),
        nodePlayer(Player, Node),
        assert(randlist([])),
        findUnits(Board, 1, 1, Piece),
        retract(randlist(Units)),
        assert(state(Board, LineBoard)),
        moveRandUnit(Units, Piece),
        
        retract(state(NewBoard, NewLineBoard)),
        findNode(NewBoard, 1, NodeRow, NodeColumn, Node),
        findall([NewNodeRow, NewNodeColumn], (((NewNodeRow is NodeRow + 1,
                                              NewNodeColumn is NodeColumn,
                                              validateNodeMove(NodeRow, NodeColumn, NewNodeRow, NewNodeColumn, NewBoard));
                                              (NewNodeRow is NodeRow - 1,
                                              NewNodeColumn is NodeColumn,
                                              validateNodeMove(NodeRow, NodeColumn, NewNodeRow, NewNodeColumn, NewBoard));
                                              (NewNodeRow is NodeRow,
                                              NewNodeColumn is NodeColumn + 1,
                                              validateNodeMove(NodeRow, NodeColumn, NewNodeRow, NewNodeColumn, NewBoard));
                                              (NewNodeRow is NodeRow,
                                              NewNodeColumn is NodeColumn - 1,
                                              validateNodeMove(NodeRow, NodeColumn, NewNodeRow, NewNodeColumn, NewBoard)))), NodeMoves),
        randPlayAux(NodeRow, NodeColumn, NewBoard, NewLineBoard, NodeMoves, Node),
        finishMove(Node, 1),
        retract(state(TempBoard, TempLineBoard)),
        displayBoard(TempBoard, TempLineBoard),
        assert(state(TempBoard, TempLineBoard)),
        !.

nextHCMove(Player):-
        Player == p1 ->
        nextMove(Player);
        randPlay(Player),!.
     
playHC :- 
        repeat,
                retract(player(Player)), nl,
                write('Player: '), write(Player), nl, nl,
                nextHCMove(Player),
                retract(nodePosition(Board, _)),
                nextPlayer(Player, Next),
                assert(player(Next)),
                finish(Player, Board),
                !.

playCC :- 
        repeat,
                retract(player(Player)), nl,
                write('Player: '), write(Player), nl, nl,
                randPlay(Player),
                retract(nodePosition(Board, _)),
                nextPlayer(Player, Next),
                assert(player(Next)),
                finish(Player, Board),
                !.

/*match :-
        init(),
        play(Type),
        retract(state(_,_)).*/
