// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import './IERC20.sol';

contract Governance {

    struct ProposalVote {
        uint againstVotes;
        uint forVotes;
        uint abstainVotes;
        mapping(address=>bool) hasVoted;
    }

    struct Proposal {
        uint votingStarts;
        uint votingEnds;
        bool executed;
    }

    enum ProposalState{Pending, Active, Succeeded, Defeated, Executed}

    mapping(bytes32 => Proposal) public proposals;
    mapping(bytes32 => ProposalVote) public proposalVotes;

    uint public constant VOTING_DELAY = 100;
    uint public constant VOTING_DURATION = 500;

    IERC20 public token;

    constructor(IERC20 _token) {
        token = _token;
    }

    function propose(
        address _to,
        uint _value,
        string calldata _func,
        bytes calldata _data,
        string calldata _description

    ) external returns(bytes32) {
        require(token.balanceOf(msg.sender)> 1, "no tokens to vote");

        bytes32 proposalId = generateProposalId(
            _to, _value, _func, _data, keccak256(bytes(_description))
        );

        require(proposals[proposalId].votingStarts==0, "proposal exists");

        proposals[proposalId] = Proposal({
            votingStarts: block.timestamp + VOTING_DELAY,
            votingEnds:  block.timestamp + VOTING_DELAY + VOTING_DURATION,
            executed: false
        });
        
        return proposalId;
    }
    function execute(
        address _to,
        uint _value,
        string calldata _func,
        bytes calldata _data,
        bytes32 _descriptionHash

    ) external returns (bytes memory){
        bytes32 proposalId = generateProposalId(
            _to, _value, _func, _data, _descriptionHash
        );
        
        require(state(proposalId)==ProposalState.Succeeded, "bad state");
        Proposal storage proposal = proposals[proposalId];

        proposal.executed = true;
        bytes memory data;
            if (bytes(_func).length > 0) {
                data = abi.encodePacked(
                    bytes4(keccak256(bytes(_func))), _data
                );
            } else {
                data = _data;
            }

            (bool success, bytes memory responce) = _to.call{value: _value}(data);
            require(success, "tx failed");

        return responce;        
    }    

    function state(bytes32 proposalId) public view returns(ProposalState) {
        Proposal storage proposal = proposals[proposalId];
        ProposalVote storage proposalsVote = proposalVotes[proposalId];

        require(proposals[proposalId].votingStarts>0, "proposal does not exists");

        if(proposal.executed) {
            return ProposalState.Pending;
        }
        if(block.timestamp < proposal.votingStarts) { 
            return ProposalState.Pending;
        }
        if(block.timestamp > proposal.votingStarts &&
                proposal.votingEnds > block.timestamp) {
            return ProposalState.Active;
        }
        if(proposalsVote.forVotes > proposalsVote.againstVotes) {
            return ProposalState.Succeeded;
        }
        else {
            return ProposalState.Defeated;
        }


    }

    function vote(bytes32 proposalId, uint8 voteType) external {
        require(state(proposalId)==ProposalState.Active, "state not active");
        
        uint votingPower = token.balanceOf(msg.sender);
        
        require(votingPower >0, "not enought tokens");

        ProposalVote storage proposalVote = proposalVotes[proposalId];

        require(!proposalVote.hasVoted[msg.sender], "already voted");

        if(voteType==0) {
            proposalVote.againstVotes += votingPower;
        } else if(voteType == 1) {
            proposalVote.forVotes += votingPower;
        } else if(voteType == 2) {
            proposalVote.abstainVotes += votingPower;
        }
        proposalVote.hasVoted[msg.sender] = true;

    }



    function generateProposalId(
        address _to,
        uint _value,
        string calldata _func,
        bytes calldata _data,
        bytes32 _descriptionHash

    ) internal pure returns (bytes32)  {
        return keccak256(abi.encode(_to, _value, _func, _data, _descriptionHash));
    }
}